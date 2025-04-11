import { Router } from "express";
import { BuyerService } from "./services/buyer.service";
import { RegisterService } from "./services/register.service";
import { BalanceService } from "./services/balance.service";

const router = Router();
const buyerService = new BuyerService();
const registerService = new RegisterService();
const balanceService = new BalanceService();

// Endpoint para testar buyerRegister
router.post("/test/buyerRegister", async (req, res) => {
  try {
    const result = await buyerService.buyerRegister(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar buyerFetch
router.post("/test/buyerFetch", async (req, res) => {
  try {
    const result = await buyerService.buyerFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar registerBatch
router.post("/test/registerBatch", async (req, res) => {
  try {
    const result = await registerService.registerBatch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar registerFetchBatch
router.post("/test/registerFetchBatch", async (req, res) => {
  try {
    const result = await registerService.registerFetchBatch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar registerFetch
router.post("/test/registerFetch", async (req, res) => {
  try {
    const result = await registerService.registerFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar fetchBalance
router.post("/test/fetchBalance", async (req, res) => {
  try {
    const result = await balanceService.fetchBalance(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
