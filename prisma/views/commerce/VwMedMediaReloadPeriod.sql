SELECT
  DISTINCT mm.csn,
  mtp.code AS "medTransitProductCode",
  mtp.description AS "medTransitProduct",
  mtp."toIssuerCode",
  mtppr.type,
  mtppr."startDate",
  mtppr."endDate",
  (
    SELECT
      count(*) AS count
    FROM
      media."MedMediaProductRecharge" mmpr
    WHERE
      (
        (mmpr."medMediaProductId" = mmp.id)
        AND COALESCE((mtppr.id) :: boolean, false)
        AND (
          mmpr."releaseDate" >= CASE
            WHEN (
              EXTRACT(
                DAY
                FROM
                  NOW()
              ) < (mtppr."monthStartDay") :: numeric
            ) THEN (
              concat(
                EXTRACT(
                  year
                  FROM
                    NOW()
                ),
                '-',
                (
                  (
                    EXTRACT(
                      MONTH
                      FROM
                        NOW()
                    )
                  ) :: integer - 1
                ),
                '-',
                mtppr."monthStartDay"
              )
            ) :: date
            ELSE (
              concat(
                EXTRACT(
                  year
                  FROM
                    NOW()
                ),
                '-',
                (
                  EXTRACT(
                    MONTH
                    FROM
                      NOW()
                  )
                ) :: integer,
                '-',
                mtppr."monthStartDay"
              )
            ) :: date
          END
        )
      )
  ) AS "rechargeCount",
  COALESCE(
    (
      SELECT
        sum(mmpr.value) AS sum
      FROM
        media."MedMediaProductRecharge" mmpr
      WHERE
        (
          (mmpr."medMediaProductId" = mmp.id)
          AND COALESCE((mtppr.id) :: boolean, false)
          AND (
            mmpr."releaseDate" >= CASE
              WHEN (
                EXTRACT(
                  DAY
                  FROM
                    NOW()
                ) < (mtppr."monthStartDay") :: numeric
              ) THEN (
                concat(
                  EXTRACT(
                    year
                    FROM
                      NOW()
                  ),
                  '-',
                  (
                    (
                      EXTRACT(
                        MONTH
                        FROM
                          NOW()
                      )
                    ) :: integer - 1
                  ),
                  '-',
                  mtppr."monthStartDay"
                )
              ) :: date
              ELSE (
                concat(
                  EXTRACT(
                    year
                    FROM
                      NOW()
                  ),
                  '-',
                  (
                    EXTRACT(
                      MONTH
                      FROM
                        NOW()
                    )
                  ) :: integer,
                  '-',
                  mtppr."monthStartDay"
                )
              ) :: date
            END
          )
        )
    ),
    (0) :: bigint
  ) AS "rechargeValue",
  COALESCE((mtppr.id) :: boolean, false) AS "hasReloadPeriod",
  COALESCE(mtppr."maxRechargeCount", 0) AS "maxReloadPeriodRechargeCount",
  COALESCE(mtppr."maxRechargeValue", 0) AS "maxReloadPeriodRechargeValue",
  CASE
    WHEN (mtppr.type = 'product' :: media."ReloadPeriodType") THEN (mtppr."maxRechargeValue") :: bigint
    WHEN (
      (mtppr.type = 'line' :: media."ReloadPeriodType")
      AND (array_length(mmp."toQuotaLineIds", 1) > 0)
    ) THEN (
      (
        SELECT
          sum(frp.price) AS sum
        FROM
          (
            (
              (
                transport."ToLine" tl
                JOIN fare."FarRule" fr ON (
                  (
                    (
                      (tl."farRuleId" IS NULL)
                      AND fr."isDefault"
                    )
                    OR (fr.id = tl."farRuleId")
                  )
                )
              )
              JOIN fare."FarRuleDate" frd ON (
                (
                  (frd."farRuleId" = fr.id)
                  AND (frd."startDate" <= NOW())
                  AND (
                    (frd."endDate" IS NULL)
                    OR (frd."endDate" > NOW())
                  )
                )
              )
            )
            JOIN fare."FarRulePrice" frp ON (
              (
                (frp."farRuleDateId" = frd.id)
                AND (
                  (
                    (frp.type = 'media' :: fare."TicketingType")
                    AND (frp."subType" = mtp.code)
                  )
                  OR (
                    (frp.type = 'media' :: fare."TicketingType")
                    AND (frp."subType" IS NULL)
                  )
                  OR (
                    (frp.type IS NULL)
                    AND (frp."subType" IS NULL)
                  )
                )
              )
            )
          )
        WHERE
          (tl.id = ANY (mmp."toQuotaLineIds"))
      ) * mtppr."quantityMultiplier"
    )
    ELSE (0) :: bigint
  END AS "maxReloadPeriodTypeRechargeValue",
  EXTRACT(
    year
    FROM
      mtppr."startDate"
  ) AS "periodYear",
  mtppr."periodId"
FROM
  (
    (
      (
        media."MedMedia" mm
        JOIN media."MedMediaProduct" mmp ON ((mmp."medMediaId" = mm.id))
      )
      JOIN media."MedTransitProduct" mtp ON ((mtp.id = mmp."medTransitProductId"))
    )
    LEFT JOIN media."MedTransitProductReloadPeriod" mtppr ON (
      (mtppr.id = mtp."medTransitProductReloadPeriodId")
    )
  )
WHERE
  (mtppr.id IS NOT NULL);