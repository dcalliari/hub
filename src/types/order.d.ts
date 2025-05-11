interface Order {
  id: number;
  salCompanyId: number;
  SalOrderItem: OrderItem[];
}

interface OrderItem {
  salEmployeeId: number;
  value: number;
}
