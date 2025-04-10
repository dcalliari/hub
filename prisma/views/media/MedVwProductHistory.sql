SELECT
  'medMediaProductUpdate' :: text AS model,
  "MedMediaProductUpdate".id,
  "MedMediaProductUpdate"."medMediaProductId",
  "MedMediaProductUpdate"."updateDate"
FROM
  media."MedMediaProductUpdate"
WHERE
  ("MedMediaProductUpdate"."isProcessed" = TRUE)
UNION
ALL
SELECT
  'medProductHotlist' :: text AS model,
  hot.id,
  hot."medMediaProductId",
  hot."updatedAt" AS "updateDate"
FROM
  (
    media."MedProductHotlist" hot
    JOIN media."MedHotlistReason" reason ON ((reason.id = hot."medHotlistReasonId"))
  );