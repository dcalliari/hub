SELECT
  rod.id,
  rod."medMediaProductId",
  rod.value,
  rod."createdAt" AS "rechargeDate",
  ro."releaseDate",
  ro."isActive",
  ro."isProcessed",
  ro."isPaid",
  ro."isCompleted",
  ro."isWaitingPayment",
  ro."paymentObservation",
  ro."paymentType",
  ro."paymentDate"
FROM
  (
    commerce."ComRechargeOrderDetail" rod
    JOIN commerce."ComRechargeOrder" ro ON ((ro.id = rod."comRechargeOrderId"))
  );