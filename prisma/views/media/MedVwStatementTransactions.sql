SELECT
  row_number() OVER (
    ORDER BY
      mmtran.id
  ) AS "unique",
  mmtran.id AS "transactionId",
  mmp.id AS "mediaProductId",
  mmtran."transactionDate",
  tt.code AS terminal,
  (
    (mmtran.balance) :: double precision / (100) :: double precision
  ) AS balance,
  mmtran.tsn,
  mmtran.rsn,
  mm.id AS "mediaId",
  mm."formatedLogical",
  (
    (mmtran.value) :: double precision / (100) :: double precision
  ) AS value,
  tto.name AS operator,
  mmtran."transactionMode",
  CASE
    WHEN (
      (
        mmtran."transactionMode" = 'usage' :: media."TransactionMode"
      )
      AND (mmtran."tktRejectId" IS NOT NULL)
    ) THEN 'Uso Rejeitado' :: text
    WHEN (
      (
        mmtran."transactionMode" = 'usage' :: media."TransactionMode"
      )
      AND (mmtran."tktUsageId" IS NOT NULL)
    ) THEN 'Uso' :: text
    WHEN (
      mmtran."transactionMode" = 'recharge' :: media."TransactionMode"
    ) THEN 'Recarga' :: text
    WHEN (
      mmtran."transactionMode" = 'creditTransfer' :: media."TransactionMode"
    ) THEN 'Transferência de Crédito' :: text
    WHEN (
      mmtran."transactionMode" = 'sale' :: media."TransactionMode"
    ) THEN 'Venda' :: text
    WHEN (
      mmtran."transactionMode" = 'manualAdjust' :: media."TransactionMode"
    ) THEN 'Ajuste Manual' :: text
    ELSE '-' :: text
  END AS "transactionModeDesc",
  mmtran."transactionType",
  CASE
    mmtran."transactionType"
    WHEN 'debit' :: media."TransactionAccountType" THEN 'Débito' :: text
    WHEN 'credit' :: media."TransactionAccountType" THEN 'Crédito' :: text
    ELSE NULL :: text
  END AS "transactionTypeDesc",
  CASE
    WHEN (
      (
        mmtran."transactionMode" = 'usage' :: media."TransactionMode"
      )
      AND (mmtran."tktUsageId" IS NOT NULL)
    ) THEN concat(
      'ID da operadora: ',
      tto.id,
      ' / Prefixo do carro: ',
      tt.code,
      ' / Linha: ',
      mmtran."toLineId",
      ' / Sentido: ',
      CASE
        mmtran."lineDirection"
        WHEN 'inbound' :: media."LineDirection" THEN 'Ida' :: text
        ELSE 'Volta' :: text
      END
    )
    WHEN (
      (
        mmtran."transactionMode" = 'usage' :: media."TransactionMode"
      )
      AND (mmtran."tktRejectId" IS NOT NULL)
    ) THEN (
      'Motivo da Rejeição: ' :: text || (
        SELECT
          split_part(trr.description, '|' :: text, 2) AS split_part
        FROM
          (
            ticketing."TktReject" tr
            LEFT JOIN ticketing."TktRejectReason" trr ON ((tr."tktRejectReasonCode" = trr.code))
          )
        WHERE
          (tr.id = mmtran."tktRejectId")
      )
    )
    WHEN (
      mmtran."transactionMode" = 'creditTransfer' :: media."TransactionMode"
    ) THEN concat(
      'Origem: ',
      (
        SELECT
          mmt2."medOriginMediaId"
        FROM
          (
            media."MedMediaProductRecharge" mmpr
            JOIN media."MedMediaTransfer" mmt2 ON ((mmt2.id = mmpr."medMediaTransferId"))
          )
        WHERE
          (mmtran."medMediaProductRechargeId" = mmpr.id)
      ),
      (
        ' / Destino: ' :: text || (
          SELECT
            mmt2."medTargetMediaId"
          FROM
            (
              media."MedMediaProductRecharge" mmpr
              JOIN media."MedMediaTransfer" mmt2 ON ((mmt2.id = mmpr."medMediaTransferId"))
            )
          WHERE
            (mmtran."medMediaProductRechargeId" = mmpr.id)
        )
      )
    )
    WHEN (
      mmtran."transactionMode" = 'sale' :: media."TransactionMode"
    ) THEN concat(
      'Nome do POS: ',
      mmtran."toTerminalId",
      ' / Transação: ',
      (
        SELECT
          ct."transactionNumber"
        FROM
          commerce."ComTransaction" ct
        WHERE
          (ct.guid = mmtran."comTransactionGuid")
      )
    )
    WHEN (
      mmtran."transactionMode" = 'recharge' :: media."TransactionMode"
    ) THEN concat(
      'Pedido: ',
      (
        SELECT
          cro."orderNumber"
        FROM
          (
            (
              media."MedMediaProductRecharge" mmpr
              LEFT JOIN commerce."ComRechargeOrderDetail" crod ON ((crod.id = mmpr."comRechargeOrderDetailId"))
            )
            LEFT JOIN commerce."ComRechargeOrder" cro ON ((cro.id = crod."comRechargeOrderId"))
          )
        WHERE
          (mmtran."medMediaProductRechargeId" = mmpr.id)
      )
    )
    ELSE NULL :: text
  END AS "tranDesc",
  mmtran."purseTransactionMode",
  mmtran."tktRejectId",
  mmtran."tktUsageId",
  tl.description AS "lineDescription",
  mtp.code AS "transitProductCode",
  mtp.description AS "transitProductDescription"
FROM
  (
    (
      (
        (
          (
            (
              (
                SELECT
                  "MedMediaTransaction".id,
                  "MedMediaTransaction"."transactionDate",
                  "MedMediaTransaction".balance,
                  "MedMediaTransaction".tsn,
                  "MedMediaTransaction".rsn,
                  "MedMediaTransaction".value,
                  "MedMediaTransaction"."transactionMode",
                  "MedMediaTransaction"."transactionType",
                  "MedMediaTransaction"."toLineId",
                  "MedMediaTransaction"."lineDirection",
                  "MedMediaTransaction"."medMediaProductRechargeId",
                  "MedMediaTransaction"."toTerminalId",
                  "MedMediaTransaction"."toTransportOperatorId",
                  "MedMediaTransaction"."medMediaProductId",
                  "MedMediaTransaction"."tktRejectId",
                  "MedMediaTransaction"."tktUsageId",
                  "MedMediaTransaction"."purseTransactionMode",
                  "MedMediaTransaction"."comTransactionGuid"
                FROM
                  media."MedMediaTransaction"
                UNION
                ALL
                SELECT
                  "MedExternalMediaTransaction".id,
                  "MedExternalMediaTransaction"."transactionDate",
                  "MedExternalMediaTransaction".balance,
                  "MedExternalMediaTransaction".tsn,
                  "MedExternalMediaTransaction".rsn,
                  "MedExternalMediaTransaction".value,
                  "MedExternalMediaTransaction"."transactionMode",
                  "MedExternalMediaTransaction"."transactionType",
                  "MedExternalMediaTransaction"."toLineId",
                  "MedExternalMediaTransaction"."lineDirection",
                  "MedExternalMediaTransaction"."medMediaProductRechargeId",
                  "MedExternalMediaTransaction"."toTerminalId",
                  "MedExternalMediaTransaction"."toTransportOperatorId",
                  "MedExternalMediaTransaction"."medMediaProductId",
                  "MedExternalMediaTransaction"."tktRejectId",
                  "MedExternalMediaTransaction"."tktUsageId",
                  "MedExternalMediaTransaction"."purseTransactionMode",
                  '' :: text AS "comTransactionGuid"
                FROM
                  media."MedExternalMediaTransaction"
              ) mmtran
              LEFT JOIN media."MedMediaProduct" mmp ON ((mmtran."medMediaProductId" = mmp.id))
            )
            LEFT JOIN media."MedTransitProduct" mtp ON ((mtp.id = mmp."medTransitProductId"))
          )
          LEFT JOIN transport."ToTerminal" tt ON (
            (
              (tt.code = mmtran."toTerminalId")
              AND (
                mmtran."toTransportOperatorId" = tt."toTransportOperatorId"
              )
            )
          )
        )
        LEFT JOIN transport."ToTransportOperator" tto ON ((mmtran."toTransportOperatorId" = tto.id))
      )
      LEFT JOIN transport."ToLine" tl ON ((tl.id = mmtran."toLineId"))
    )
    LEFT JOIN media."MedMedia" mm ON ((mm.id = mmp."medMediaId"))
  )
ORDER BY
  mmtran."transactionDate" DESC;