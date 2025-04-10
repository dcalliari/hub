SELECT
  count(1) AS total,
  tp.description AS product
FROM
  (
    (
      media."MedProductHotlist" ph
      JOIN media."MedMediaProduct" mp ON ((mp.id = ph."medMediaProductId"))
    )
    JOIN media."MedTransitProduct" tp ON ((tp.id = mp."medTransitProductId"))
  )
WHERE
  (
    (
      ph."createdAt" + (
        COALESCE(
          current_setting('app.time_zone' :: text, TRUE),
          '3 hour' :: text
        )
      ) :: INTERVAL
    ) >= (NOW() - '90 days' :: INTERVAL)
  )
GROUP BY
  tp.description;