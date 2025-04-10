SELECT
  mm.id,
  mm.sequence,
  mm."checkDig",
  mm."formatedLogical",
  mm."toIssuerCode",
  mm."isProcessed",
  mm.csn,
  mm."isActive",
  mm."medMediaTypeId",
  mm."blameUser" AS "blameUserMedMedia",
  mm."createdAt",
  mm."updatedAt",
  mm."usrUserId",
  mm.bss_id,
  mm."reissueSequence",
  mm."recordDate",
  uu.birthdate,
  uu.name,
  uu."socialName",
  mmt.description AS "mediaDescription"
FROM
  (
    (
      media."MedMedia" mm
      LEFT JOIN "user"."UsrUser" uu ON ((mm."usrUserId" = uu.id))
    )
    LEFT JOIN media."MedMediaType" mmt ON ((mmt.id = mm."medMediaTypeId"))
  );