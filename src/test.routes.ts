import { Router } from "express";
import { BuyerService } from "./services/buyer.service";
import { RegisterService } from "./services/register.service";
import { BalanceService } from "./services/balance.service";
import { UserService } from "./services/user.service";
import { CardService } from "./services/card.service";
import { FareService } from "./services/fare.service";

const router = Router();
const buyerService = new BuyerService();
const registerService = new RegisterService();
const balanceService = new BalanceService();
const userService = new UserService();
const cardService = new CardService();
const fareService = new FareService();

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
router.post("/test/balanceFetch", async (req, res) => {
  try {
    const result = await balanceService.balanceFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar userRecharge
router.post("/test/userRecharge", async (req, res) => {
  try {
    const result = await userService.userRecharge(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar userRechargeFetch
router.post("/test/userRechargeFetch", async (req, res) => {
  try {
    const result = await userService.userRechargeFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar cardReplacement
router.post("/test/cardReplacement", async (req, res) => {// TODO: verificar erro 400 msg: Erro de processamento
  try {
    const result = await cardService.cardReplacement(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar cardReplacementFetch
router.post("/test/cardReplacementFetch", async (req, res) => {// TODO: verificar erro 400 msg: Erro de processamento
  try {
    const result = await cardService.cardReplacementFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar cardUnlock
router.post("/test/cardUnlock", async (req, res) => {
  try {
    const result = await cardService.cardUnlock(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar fareFetch
router.post("/test/fareFetch", async (req, res) => {
  try {
    const result = await fareService.fareFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para testar userAbuseFetch
router.post("/test/userAbuseFetch", async (req, res) => {
  try {
    const result = await userService.userAbuseFetch(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
