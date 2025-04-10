SELECT
  count(1) AS total,
  (
    ("MedHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  ) AS DAY
FROM
  media."MedHotlist"
WHERE
  (
    "MedHotlist"."createdAt" >= (
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
    ("MedHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  )
ORDER BY
  (
    ("MedHotlist"."createdAt") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  );