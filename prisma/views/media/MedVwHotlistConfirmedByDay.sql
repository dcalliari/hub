SELECT
  count(1) AS total,
  (
    ("MedHotlist"."statusDate") :: date + (
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
    "MedHotlist"."statusDate" >= (
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
    ("MedHotlist"."statusDate") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  )
ORDER BY
  (
    ("MedHotlist"."statusDate") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  );