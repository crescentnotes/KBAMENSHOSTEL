import express from "express";

const router =express.Router();

router.get('/',(req,res)=>{
    res.render("maintenance");
})

router.get('/housekeeping', (req, res) => {
    res.render('maintenance/housekeeping');   
  });
router.get('/electricalworks',(req,res)=>{
    res.render('maintenance/electricalworks')
})  
router.get('/carpentry',(req,res)=>{
    res.render('maintenance/carpentry')
})
export default router;

