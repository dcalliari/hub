SELECT
  mmt.id AS "medMediaTransactionId",
  mmt."medMediaProductId",
  mm."formatedLogical",
  (mm.csn) :: text AS csn,
  mmt.balance,
  lmmt.balance AS "currentBalance",
  (mmt.value) :: text AS value,
  mmtype.description AS "medMediaTypeDescription",
  mmp."medMediaId",
  mtp.description AS "medMediaProductDescription",
  mmt."transactionDate",
  mmt."transactionType",
  mmt."transactionMode",
  mmt."toTerminalId",
  ttg.description AS "toTerminalGroupDescription",
  mmt."toLineId",
  tl.description AS "toLineDescription",
  tl."shortDesc",
  mmt."toTransportOperatorId",
  tto.name AS "toTransportOperatorDescription"
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
                    (
                      media."MedMediaTransaction" mmt
                      JOIN media."MedMediaProduct" mmp ON ((mmt."medMediaProductId" = mmp.id))
                    )
                    JOIN media."MedMediaProductState" mmps ON ((mmps."medMediaProductId" = mmp.id))
                  )
                  JOIN media."MedMediaTransaction" lmmt ON ((mmps."medMediaTransactionId" = lmmt.id))
                )
                JOIN media."MedMedia" mm ON ((mmp."medMediaId" = mm.id))
              )
              JOIN media."MedMediaType" mmtype ON ((mm."medMediaTypeId" = mmtype.id))
            )
            JOIN transport."ToTransportOperator" tto ON ((mmt."toTransportOperatorId" = tto.id))
          )
          JOIN transport."ToLine" tl ON ((mmt."toLineId" = tl.id))
        )
        JOIN transport."ToTerminal" ttl ON ((mmt."toTerminalId" = ttl.code))
      )
      JOIN transport."ToTerminalGroup" ttg ON ((ttl."toTerminalGroupId" = ttg.id))
    )
    JOIN media."MedTransitProduct" mtp ON ((mmp."medTransitProductId" = mtp.id))
  );