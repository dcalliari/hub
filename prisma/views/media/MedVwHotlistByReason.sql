SELECT
  count(1) AS total,
  mhr.description AS reason
FROM
  (
    (
      media."MedHotlist" mh
      JOIN media."MedMedia" mm ON ((mm.id = mh."medMediaId"))
    )
    JOIN media."MedHotlistReason" mhr ON ((mhr.id = mh."medHotlistReasonId"))
  )
WHERE
  (
    (
      mh."createdAt" + (
        COALESCE(
          current_setting('app.time_zone' :: text, TRUE),
          '3 hour' :: text
        )
      ) :: INTERVAL
    ) >= (NOW() - '90 days' :: INTERVAL)
  )
GROUP BY
  mhr.description;