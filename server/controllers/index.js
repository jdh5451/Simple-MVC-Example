// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAddedCat = new Cat(defaultCatData);
let lastAddedDog = new Dog(defaultDogData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAddedCat.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};

const readCat = (req, res) => {
  const name1 = req.query.name;

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.json(doc);
  };
  Cat.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }

    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};

const getName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAddedCat = newCat;
    res.json({
      name: lastAddedCat.name,
      beds: lastAddedCat.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'firstname,lastname, breed, and age are all required' });
  }

  const name = `${req.body.firstname} ${req.body.lastname}`;

  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAddedDog = newDog;
    res.json({
      name: lastAddedDog.name,
      breed: lastAddedDog.breed,
      age: lastAddedDog.age,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'No Cats Found!' }); }
    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  });
};

const updateLast = (req, res) => {
  lastAddedCat.bedsOwned++;

  const savePromise = lastAddedCat.save();
  savePromise.then(() => {
    res.json({
      name: lastAddedCat.name,
      beds: lastAddedCat.bedsOwned,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const updateSearchedDog = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  /* let tempDog;
  Dog.findByName(req.body.name, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'No Dogs Found!' }); }
      tempDog=new Dog({name:doc.name,breed:doc.breed,age:doc.age,});
      return res.json({
          name:tempDog.name,
          breed: tempDog.breed,
          age: tempDog.age,
      });
  });

  console.dir(tempDog);
  tempDog.age++;

  const savePromise = tempDog.save();
  savePromise.then(() => {
    res.json({
      name: tempDog.name,
      breed: tempDog.breed,
      age: tempDog.age,
    });
  });

  savePromise.catch((err) => {
    res.status(500).json({ err });
  }); */

  // return res;
  // could not figure out how the heck to combine these functions
  // gave up because i spent 4 hours on this
  // no longer productive
  Dog.findByName(req.body.name, (err, doc) => {
    if (err) { return res.status(500).json({ err }); }
    if (!doc) { return res.json({ warning: 'No Dogs Found!' }); }

    return res.json({
      name: doc.name,
      breed: doc.breed,
      age: doc.age,
    });
  });

  return res;
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  getName,
  setName,
  setDogName,
  updateSearchedDog,
  updateLast,
  searchName,
  notFound,
};
