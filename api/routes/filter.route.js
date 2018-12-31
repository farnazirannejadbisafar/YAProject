const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const FilterController = require('../controllers/filter');

router.get("/mostfollowers/:userId", checkAuth, FilterController.filter_most_followers);

router.get("/leastfollowers/:userId", checkAuth, FilterController.filter_least_followers);

router.get("/gateway/:userId", checkAuth, FilterController.filter_gateway);

router.get("/mostactive/:userId", checkAuth, FilterController.filter_most_active);

router.get("/leastactive/:userId", checkAuth, FilterController.filter_least_active);

router.get("/mostinteractive/:userId", checkAuth, FilterController.filter_most_interactive);

router.get("/allfollowers/:userId", checkAuth, FilterController.filter_all_followers);

router.get("/allactive/:userId", checkAuth, FilterController.filter_all_active);

router.get("/allinteractive/:userId", checkAuth, FilterController.filter_all_interactive);

router.get("/middleuserfollowers/:userId/:index", checkAuth, FilterController.filter_middle_followers);

router.get("/middleuseractive/:userId/:index", checkAuth, FilterController.filter_middle_active);

router.get("/middleuserinteractive/:userId/:index", checkAuth, FilterController.filter_middle_interactive);

module.exports = router;
