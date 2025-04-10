SELECT
  count(1) AS total,
  (
    ("MedMediaProductRecharge"."liveDate") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  ) AS DAY
FROM
  media."MedMediaProductRecharge"
WHERE
  (
    "MedMediaProductRecharge"."liveDate" >= (
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
    ("MedMediaProductRecharge"."liveDate") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  )
ORDER BY
  (
    ("MedMediaProductRecharge"."liveDate") :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  );