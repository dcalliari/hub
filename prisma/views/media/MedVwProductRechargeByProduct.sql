SELECT
  count(1) AS total,
  tp.description AS product
FROM
  (
    (
      media."MedMediaProductRecharge" pr
      JOIN media."MedMediaProduct" mp ON ((mp.id = pr."medMediaProductId"))
    )
    JOIN media."MedTransitProduct" tp ON ((tp.id = mp."medTransitProductId"))
  )
WHERE
  (
    (
      pr."createdAt" + (
        COALESCE(
          current_setting('app.time_zone' :: text, TRUE),
          '3 hour' :: text
        )
      ) :: INTERVAL
    ) >= (NOW() - '90 days' :: INTERVAL)
  )
GROUP BY
  tp.description;