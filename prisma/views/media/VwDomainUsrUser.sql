SELECT
  us.id AS "usrUserId",
  us."externalId",
  ud.value AS "mainDocument"
FROM
  (
    "user"."UsrUser" us
    LEFT JOIN "user"."UsrDocument" ud ON ((ud.id = us."usrMainDocumentId"))
  );