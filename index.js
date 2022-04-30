const express = require('express');
const { redirect } = require('express/lib/response');
const mongoose = require('mongoose');
const path =  require('path');
const urlencodedParser = express.urlencoded({extended: false});

const app = express();

app.set('views', path.join(__dirname,'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));


mongoose.Promise = global.Promise;

async function start() {
	try {
	  await mongoose.connect(
		'mongodb+srv://haykaramNik:1q2w3e4r@cluster0.pv5b7.mongodb.net/users',
		{
		  useNewUrlParser: true,
		  useUnifiedTopology: true
		}
	  )
	  app.listen(3000, () => {
		console.log('Server has been started...');
	  })
	} catch (e) {
	  console.log(e)
	}
}

start()

const Schema = mongoose.Schema;

const schema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 3,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 3,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        maxlength: 20,
        minlength: 4,
        trim: true
    },
	adress: {
        city: {
			type: String,
			required: true,
			maxlength: 15,
			minlength: 3,
			trim: true
		},
		state: {
			type: String,
			required: true,
			maxlength: 15,
			minlength: 3,
			trim: true
		},
		houseNumber: {
			type: Number,
			required: true,
			maxlength: 20,
			minlength: 4,
			trim: true
		}
    },
});


let Users = mongoose.model('Users', schema);

app.post('/create', urlencodedParser, async (req, res) => {
	const user = new Users({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone,
		adress: {
			city: req.body.city,
			state: req.body.state,
			houseNumber: req.body.houseNumber
		}
	})
  
	await user.save()
	res.redirect('/')
})

app.post('/change', urlencodedParser, async (req, res) => {
	const user = await Users.findByIdAndUpdate(req.body.id,{
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		phone: req.body.phone,
		adress: {
			city: req.body.city,
			state: req.body.state,
			houseNumber: req.body.houseNumber
		}
	});
	res.redirect('/');
});

app.post('/delete', urlencodedParser, async (req, res) => {
	const user = await Users.findByIdAndDelete(req.body.id2);
	res.redirect('/');
})


app.get('/', async (req, res) => {
	const user1 = await Users.find({})
	res.render('pages/index', {
		title: 'Phone Numbers',
		user1,
	})
})

app.get('/create',(req,res)=>{
	res.render('pages/create',{
		title: 'Create Phone Number'
	});
})
