SELECT
  count(1) AS total,
  (
    ("MedProductHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  ) AS DAY
FROM
  media."MedProductHotlist"
WHERE
  (
    "MedProductHotlist"."createdAt" >= (
      (
        (NOW()) :: date + (
          COALESCE(
            current_setting('app.time_zone' :: text, TRUE),
            '3 hour' :: text
          )
        ) :: INTERVAL
      ) - '30 days' :: INTERVAL
    )
  )
GROUP BY
  (
    ("MedProductHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  )
ORDER BY
  (
    ("MedProductHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  );