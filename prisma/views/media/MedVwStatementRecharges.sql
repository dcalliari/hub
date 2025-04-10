SELECT
  mmpr.id AS "productRechargeId",
  mmpr."medMediaProductId",
  mmpr."usrOrganizationId",
  mmpr."releaseDate",
  mmpr.type,
  mmpr.rsn,
  (
    (mmpr.value) :: double precision / (100) :: double precision
  ) AS value,
  mm.id AS "mediaId",
  mmpr."isProcessed",
  mmpr."isRecharged",
  mmpr."isActive",
  mmpr."isTransfer",
  tto.name AS "operatorName",
  mmpr."toTerminalCode",
  cm."toTransportOperatorId",
  cm.name AS "tramportOperatorName",
  tt.description AS "terminalDescription",
  mmp."medTransitProductId",
  cro."orderNumber",
  uo.name AS "organizationName",
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
                (
                  (
                    media."MedMediaProductRecharge" mmpr
                    LEFT JOIN media."MedMediaProduct" mmp ON ((mmpr."medMediaProductId" = mmp.id))
                  )
                  LEFT JOIN media."MedTransitProduct" mtp ON ((mtp.id = mmp."medTransitProductId"))
                )
                LEFT JOIN media."MedMedia" mm ON ((mm.id = mmp."medMediaId"))
              )
              LEFT JOIN commerce."ComRechargeOrderDetail" crod ON ((crod.id = mmpr."comRechargeOrderDetailId"))
            )
            LEFT JOIN commerce."ComRechargeOrder" cro ON ((cro.id = crod."comRechargeOrderId"))
          )
          LEFT JOIN commerce."ComMerchant" cm ON ((cro."comMerchantId" = cm.id))
        )
        LEFT JOIN transport."ToTransportOperator" tto ON ((tto.id = cm."toTransportOperatorId"))
      )
      LEFT JOIN transport."ToTerminal" tt ON (
        (
          (tt.code = mmpr."toTerminalCode")
          AND (
            tt."toTransportOperatorId" = cm."toTransportOperatorId"
          )
        )
      )
    )
    LEFT JOIN "user"."UsrOrganization" uo ON ((uo.id = mmpr."usrOrganizationId"))
  )
WHERE
  (
    (mmpr."isRecharged" = false)
    AND (mmpr."isActive" = TRUE)
  )
ORDER BY
  mmpr."releaseDate" DESC,
  mmpr.rsn DESC;