WITH params AS (
  SELECT
    max(
      CASE
        WHEN (
          (sys_parameter.sp_code) :: text = 'currentyear_school' :: text
        ) THEN (sys_parameter.sp_value) :: integer
        ELSE NULL :: integer
      END
    ) AS v_currentyear
  FROM
    system.sys_parameter
)
SELECT
  sc.sc_id,
  sc.ss_id,
  sch.ss_description AS school_description,
  sc.sc_year,
  sc.sc_studentname,
  sc.sc_mothername,
  sc.sc_fathername,
  sc.sc_birthdate,
  COALESCE(sl.description, 'Não Especificada' :: text) AS student_level_description,
  COALESCE(
    scg.scg_descricao,
    'Não Especificada' :: character varying
  ) AS grade_description,
  COALESCE(sp.description, 'Não Especificada' :: text) AS period_description,
  sc.sc_class,
  sc.sc_registration,
  sc.sc_course,
  sc.sc_batchnumber,
  sc.sc_createdat,
  sc.sc_updatedat,
  sc.sc_blameuser,
  CASE
    WHEN ((sc.sc_status) :: text = 'R' :: text) THEN 'Regular' :: text
    WHEN ((sc.sc_status) :: text = 'A' :: text) THEN 'Abandono' :: text
    WHEN ((sc.sc_status) :: text = 'T' :: text) THEN 'Transferido' :: text
    ELSE 'Não Especificado' :: text
  END AS sc_status,
  sc.sc_isactive,
  sc.sc_protocol,
  sc.sc_recad
FROM
  (
    (
      (
        (
          (
            salesportal.sc_student sc
            LEFT JOIN "user"."UsrStudentLevel" sl ON ((sc.sc_educationlevel = sl.id))
          )
          LEFT JOIN "user".sc_grade scg ON ((sc.sc_grade = scg.scg_id))
        )
        LEFT JOIN "user"."UsrStudentPeriod" sp ON ((sc.sc_period = sp.id))
      )
      LEFT JOIN salesportal.ss_school sch ON ((sc.ss_id = sch.ss_id))
    )
    CROSS JOIN params
  )
WHERE
  (sc.sc_year = params.v_currentyear);