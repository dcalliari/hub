interface Order {
  id: number;
  salCompanyId: number;
  SalOrderItem: OrderItem[];
}

type OrderItem = {
  salEmployeeId: number;
  value: number;
}
