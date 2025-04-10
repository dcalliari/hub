SELECT
  mm.id AS "mediaId",
  mm."formatedLogical",
  mm.csn,
  mm."isActive",
  mmp.id AS "mediaProductId",
  mmps.id AS "mediaProductState",
  mmt.id AS "mediaTransactionId",
  mmt.balance,
  mtp.description AS "mediaTransitProductDescription",
  mtp.code AS "mediaTransitProductCode",
  mtp."maxValue"
FROM
  (
    (
      (
        (
          media."MedMedia" mm
          LEFT JOIN media."MedMediaProduct" mmp ON ((mmp."medMediaId" = mm.id))
        )
        LEFT JOIN media."MedMediaProductState" mmps ON ((mmps."medMediaProductId" = mmp.id))
      )
      LEFT JOIN media."MedMediaTransaction" mmt ON ((mmt.id = mmps."medMediaTransactionId"))
    )
    LEFT JOIN media."MedTransitProduct" mtp ON ((mtp.id = mmp."medTransitProductId"))
  );