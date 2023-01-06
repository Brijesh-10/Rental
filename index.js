const express=require("express")
const path=require("path")
const fileupload=require("express-fileupload")
var con=require('./connection')
const bodyparser=require("body-parser")
const port=1000;
const app=express();
const session=require('express-session');
const hbs= require("hbs")

app.use(session({'secret':'kabira', secret:'mine',
resave: false,
saveUninitialized:false}))

app.use(fileupload());

const staticpath=path.join(__dirname, "./public");
app.use(express.static(staticpath))
// // // to set view enegine
app.set('view engine', 'hbs');


app.set('views',path.join(__dirname, "./views"))

app.use(bodyparser.json({limit:'100mb'}));
app.use(bodyparser.urlencoded({limit:'100mb',extended:true}));

const redirectlogin=(req,res,next)=>{
    if(!req.session.login){
        res.redirect('/sign_in')
    }
    else{
            next()
    }
}

app.get("/", (req,res)=>{
    // if(req.session.login){
    //     var sql="SELECT img,pname,rent,pid FROM product where pname='Smart-Tv';SELECT img,pname,pid,rent FROM product where pname='Air-Conditioner';SELECT img,pname,pid,rent FROM product where pname='Speaker';Select * FROM sign where email='"+req.session.login+"';" 
    //     con.query(sql,(err,data)=>{
    //         if(err)throw err
    //         // console.log(data[0])
    //         // console.log(data[1])
    //         res.render('index',{x:data[0],y:data[1],z:data[2],z:data[3],tips:req.session.login})
    //     }) 
    // }
     var sql="SELECT img,pname,rent,pid FROM product where pname='Smart-Tv';SELECT img,pname,pid,rent FROM product where pname='Air-Conditioner';SELECT img,pname,pid,rent FROM product where pname='Speaker';" 
    con.query(sql,(err,data)=>{
        if(err)throw err
        // console.log(data[0])
        // console.log(data[1])
        res.render('index',{x:data[0],y:data[1],z:data[2],tips:req.session.login})
})}
   
    // console.log(req.session.login)
    // console.log("2")
)
app.post("/",(req,res)=>{
    if(req.body.hasOwnProperty("pd")){
        //console.log(req.body.pid)
        req.session.p=req.body.pd
        // console.log(req.body.pd)
        res.redirect("product")
    }
    // console.log(x.pid)
    console.log("him")

})
app.get("/sign_in", (req,res)=>{
    res.render('sign_in')
})
app.post("/sign_in",(req,res)=>{
    var sql="select email from sign where email='"+req.body.cemail+"' and pwd='"+req.body.cpwd+"'";
    con.query(sql,function(error,data){
         if(error)throw error;
        //  console.log(data[0])
         if(data[0]){
            req.session.login=req.body.cemail
            console.log("hi",req.session.login)
            res.redirect(`/`)
         }
         else{
            res.redirect(`./html/sign_in-er.html`)
         }
     })
      })
      app.get("/sign_up", (req,res)=>{
        res.render('sign_up')
    })
app.post("/sign_up", (req,res)=>{
    // console.log("hi")
    var sql1="select email from sign where email='"+req.body.email+"' or mno='"+req.body.mno+"'";
    con.query(sql1,function(error,result){
            console.log(result[0])
            // console.log(sql1.mno)
            // console.log("1")
            if(error){throw error
                res.redirect(`./html/sign_up-er.html`) }
            if(result[0]){
                console.log(result.email)
                console.log(result.mno)
                res.redirect(`./html/sign_up-er.html`) 
            }
            else{
                var sql2="insert into sign values('"+req.body.fname+"', '"+req.body.lname+"', '"+req.body.email+"', '"+req.body.mno+"','"+req.body.pwd+"')";
                console.log(req.body)
                con.query(sql2,function(error,result){
                    try{if(error){
                        throw error
                        res.redirect(`./html/sign_up-er.html`) 
                        }
                    else{
                        req.session.login=req.body.email
                        console.log("bye",req.session.login)
                        res.redirect(`/`)
                    }}
                    catch(err){
                        throw err
                        console.log("wrong1")
                        res.redirect(`./html/sign_up-er.html`) }
                    
                    })
            }
    })
    
   })

app.get("/forgot_pwd", (req,res)=>{
    res.render('forgot_pwd')
})
app.post("/forgot_pwd", (req,res)=>{
    var sql="update sign set pwd='"+req.body.fpwd+"' where email='"+req.body.email_id+"'";
    con.query(sql,function(error,data){
         if(error)throw error;
         console.log(data[0])
         if(!data[0]){
            res.redirect(`/`)
         }
         else{
            res.redirect(`./html/forg-er.html`)
         }
     })
})

app.get("/product-details", redirectlogin,(req,res)=>{
    res.render('product-details')
})

app.post("/product-details", (req,res)=>{
try{

    if(req.session.login==req.body.email){

            function pid(){ var ch=['A','B','C','D','E','F','1','2','3','8','9','5','6','7']
            var result=''
            for(var i=0;i<5;i++)
            {
                result+=ch[Math.floor(Math.random()*11)]
            }
            return result
        } pd=pid()
        console.log(pd)
            var sql2="select pid from product where pid='"+pd+"'";
            con.query(sql2,function(error,data){
                while(true){
                    if(data[0]==pd){pd=pid()}
                    else{
                        break
                    }
                }
               if(error)throw error
                file=req.files.pic
                console.log("file")
                console.log(file)
                console.log(req.body.select)
                if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif"||file.mimetype == "image/jpg"){
                    file.mv('public/pic/upload/'+file.name)
                    var sql3="insert into product values('"+pd+"', '"+req.body.select+"', '"+req.body.company+"', '"+req.body.color+"','"+req.body.power+"', '"+req.body.rent+"', '"+req.body.dimension+"', '"+req.body.model+"', '"+file.name+"', '"+req.body.rday+"', '"+req.body.email+"')";
                    con.query(sql3,(error,data)=>{
                        if(error)
                        throw error
                        else{
                            res.redirect(`/`)
                        }
                    })
                }
                else{
                    res.redirect(`./html/product-er.html`)   
                }
               
            })
            
        }

        else{
           res.redirect(`./html/product-er.html`)
        }
    }
    catch(error){
        throw error;
        console.log("wrong")
    }
})


app.get("/product",(req,res)=>{
   // res.render(`product`)
    pd=req.session.p
    // console.log(pd)
    var sql="SELECT * FROM product where pid='"+pd+"';"
    con.query(sql,(err,data)=>{
        if(err)throw err;
        res.render(`product`,{x:data})
    })
})

app.post("/product",(req,res)=>{
    
})
app.get("/day",redirectlogin,(req,res)=>{
    res.render(`day`)
})
app.post("/day",(req,res)=>{
    pd=req.session.p
    console.log(pd)
    var sql="SELECT rdays,rent,email,img,pname FROM product where pid='"+pd+"';"
    con.query(sql,(err,data)=>{
        if(err)throw err
        console.log(req.body.select)
        console.log(data[0].rdays)
        if(data[0].rdays>=req.body.select){
            // console.log(data.rent)
            var sql1="insert into cart values('"+data[0].email+"', '"+pd+"', '"+data[0].rent+"', '"+data[0].rdays+"', '"+req.session.login+"', '"+data[0].img+"', '"+data[0].pname+"')";
            con.query(sql1,(err,data)=>{
                if(err)throw err
                res.redirect("/")
            })
        }
        else{
            console.log(data[0])
            console.log(data.rdays)
            res.redirect('./html/day-er.html')
        }
    })
    
})







app.get("/cart", redirectlogin,(req,res)=>{
    var sql="SELECT * FROM cart where sign='"+req.session.login+"' limit 0,3;"
    con.query(sql,(err,data)=>{
        res.render('cart',{x: data})
    })
})

app.post("/cart",(req,res)=>{
    if(req.body.hasOwnProperty("remove")){
        p=req.body.remove
        //console.log(p)
        var sql="delete from cart where pid='"+p+"';"
        con.query(sql,(err,data)=>{
            if(err)throw err
            res.redirect("/cart")
        })
        
    }

})


app.listen(port,()=>{
    console.log("the application started");
})




