SELECT
  count(1) AS total,
  (
    (
      (
        (
          (
            (
              EXTRACT(
                year
                FROM
                  (
                    "MedMediaProductRecharge"."rechargeDate" + (
                      COALESCE(
                        current_setting('app.time_zone' :: text, TRUE),
                        '3 hour' :: text
                      )
                    ) :: INTERVAL
                  )
              ) || '/' :: text
            ) || EXTRACT(
              MONTH
              FROM
                (
                  "MedMediaProductRecharge"."rechargeDate" + (
                    COALESCE(
                      current_setting('app.time_zone' :: text, TRUE),
                      '3 hour' :: text
                    )
                  ) :: INTERVAL
                )
            )
          ) || '/' :: text
        ) || '01' :: text
      )
    ) :: date + (
      COALESCE(
        current_setting('app.time_zone' :: text, TRUE),
        '3 hour' :: text
      )
    ) :: INTERVAL
  ) AS MONTH
FROM
  media."MedMediaProductRecharge"
WHERE
  (
    "MedMediaProductRecharge"."rechargeDate" >= (
      (
        date_trunc('month' :: text, NOW()) + (
          COALESCE(
            current_setting('app.time_zone' :: text, TRUE),
            '3 hour' :: text
          )
        ) :: INTERVAL
      ) - '1 year' :: INTERVAL
    )
  )
GROUP BY
  (
    EXTRACT(
      year
      FROM
        (
          "MedMediaProductRecharge"."rechargeDate" + (
            COALESCE(
              current_setting('app.time_zone' :: text, TRUE),
              '3 hour' :: text
            )
          ) :: INTERVAL
        )
    )
  ),
  (
    EXTRACT(
      MONTH
      FROM
        (
          "MedMediaProductRecharge"."rechargeDate" + (
            COALESCE(
              current_setting('app.time_zone' :: text, TRUE),
              '3 hour' :: text
            )
          ) :: INTERVAL
        )
    )
  )
ORDER BY
  (
    EXTRACT(
      year
      FROM
        (
          "MedMediaProductRecharge"."rechargeDate" + (
            COALESCE(
              current_setting('app.time_zone' :: text, TRUE),
              '3 hour' :: text
            )
          ) :: INTERVAL
        )
    )
  ),
  (
    EXTRACT(
      MONTH
      FROM
        (
          "MedMediaProductRecharge"."rechargeDate" + (
            COALESCE(
              current_setting('app.time_zone' :: text, TRUE),
              '3 hour' :: text
            )
          ) :: INTERVAL
        )
    )
  );