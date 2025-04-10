SELECT
  row_number() OVER (
    ORDER BY
      mm.id
  ) AS "unique",
  mm.id AS "mediaId",
  mm."createdAt",
  mm."blameUser",
  mmt.description AS "medMediaTypeDescription",
  (
    SELECT
      ((udt.description || ' - ' :: text) || ud.value)
    FROM
      (
        "user"."UsrDocument" ud
        LEFT JOIN "user"."UsrDocumentType" udt ON ((udt.id = ud."usrDocumentTypeId"))
      )
    WHERE
      (
        (ud."usrUserId" = mm."usrUserId")
        AND (
          (udt."isMain" = TRUE)
          OR (ud."isActive" = TRUE)
        )
      )
    ORDER BY
      udt."isMain" DESC
    LIMIT
      1
  ) AS document,
  mm."formatedLogical",
  uu.name AS "usrName",
  uu."socialName" AS "usrSocialName",
  (
    SELECT
      string_agg(DISTINCT ut.description, ', ' :: text) AS string_agg
    FROM
      (
        "user"."_UsrTypeToUsrUser" uttuu
        JOIN "user"."UsrType" ut ON ((ut.id = uttuu."A"))
      )
    WHERE
      (uttuu."B" = uu.id)
  ) AS "usrTypes"
FROM
  (
    (
      (
        media."MedMediaProduct" mmp
        LEFT JOIN media."MedMedia" mm ON ((mm.id = mmp."medMediaId"))
      )
      LEFT JOIN media."MedMediaType" mmt ON ((mmt.id = mm."medMediaTypeId"))
    )
    LEFT JOIN "user"."UsrUser" uu ON ((uu.id = mm."usrUserId"))
  );