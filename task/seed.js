const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const users = data.users;
const profiles = data.profile;
const events = data.events;
const reports = data.reports;
const comments = data.comments;
const followers = data.followers;

async function main() {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  //user
  // Manyu Dhyani, Chakravarti Kothadiya , Kshitij Chaudhari, Raheem Ali
  const admin1 = await users.createUser(
    "ManyuDhyani",
    "ManyuDhyani@gmail.com",
    "25",
    "Stonkystonk1%",
    (admin = true)
  );
  const admin2 = await users.createUser(
    "ChakravartiKothadiya",
    "Chakravarti@gmail.com",
    "44",
    "Shakalaka2%",
    (admin = true)
  );
  const admin3 = await users.createUser(
    "KshitijChaudhari",
    "KshitijChaudhari@gmail.com",
    "18",
    "Royaltyawaits3%",
    (admin = true)
  );
  const admin4 = await users.createUser(
    "RaheemAli",
    "RaheemAli@gmail.com",
    "30",
    "StylePoetic%4",
    (admin = true)
  );

  const user1 = await users.createUser(
    "user1",
    "user1@gmail.com",
    "25",
    "User1$$1"
  );
  const user2 = await users.createUser(
    "user2",
    "user2@gmail.com",
    "44",
    "User2$$2"
  );
  const user3 = await users.createUser(
    "user3",
    "user3@gmail.com",
    "18",
    "User3$$3"
  );
  const user4 = await users.createUser(
    "user4",
    "user4@gmail.com",
    "30",
    "User4$$4"
  );
  const user5 = await users.createUser(
    "user5",
    "user5@gmail.com",
    "18",
    "User5$$5"
  );
  const user6 = await users.createUser(
    "user6",
    "user6@gmail.com",
    "30",
    "User6$$6"
  );

  // get userId of admins for inserting data
  const getId = await users.checkUser("RaheemAli", "StylePoetic%4");
  const getId2 = await users.checkUser("KshitijChaudhari", "Royaltyawaits3%");
  const getId3 = await users.checkUser("ChakravartiKothadiya", "Shakalaka2%");
  const getId4 = await users.checkUser("ManyuDhyani", "Stonkystonk1%");
  // console.log(getId.loggedUser._id)
  const extractId = getId.loggedUser._id;
  const extractId2 = getId2.loggedUser._id;
  const extractId3 = getId3.loggedUser._id;
  const extractId4 = getId4.loggedUser._id;

  // get userId of users for inserting data
  const getUserId3 = await users.checkUser("user3", "User3$$3");
  const getUserId4 = await users.checkUser("KshitijChaudhari", "Royaltyawaits3%");
  // console.log(extractId)
  const extractUserId3 = getUserId3.loggedUser._id;
  const extractUserId4 = getUserId4.loggedUser._id;
  //profiles section

  //profile image
  const image = {
    fieldname: "avatar",
    originalname: "abc2.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "public/uploads/profilePictures",
    filename: "abc2.jpg",
    // path: "public\\uploads\\profilePictures\\1671353429155.jpg",
    path: "public\\uploads\\profilePictures\\abc2.jpg",
    size: 3031502,
  };
  //profile-details
  const profile1 = await profiles.createProfile(
    extractId,
    "Raheem",
    "Ali",
    "Male",
    image,
    "www.raheem.com",
    "www.youtube.com/raheem",
    "America 14 street",
    "America 14 street",
    "New York",
    "Alaska",
    "America",
    "99501",
    "Interest in Web3"
  );
  const profile2 = await profiles.createProfile(
    extractId3,
    "Chakravarti",
    "Kothadiya",
    "Male",
    image,
    "www.Chakravarti.com",
    "www.youtube.com/Chakravarti",
    "America 14 street",
    "America 14 street",
    "New York",
    "Alaska",
    "America",
    "99501",
    "Interest in Web3"
  );

  const profile3 = await profiles.createProfile(
    extractId2,
    "Kshitij",
    "Chaudhari",
    "Male",
    image,
    "www.Chaudhari.com",
    "www.youtube.com/Chaudhari",
    "America 14 street",
    "America 14 street",
    "New York",
    "Alaska",
    "America",
    "99501",
    "Interest in Web3"
  );

  const profile4 = await profiles.createProfile(
    extractId4,
    "Manyu",
    "Dhyani",
    "Male",
    image,
    "www.Dhyani.com",
    "www.youtube.com/Dhyani",
    "America 14 street",
    "America 14 street",
    "New York",
    "Alaska",
    "America",
    "99501",
    "Interest in Web3"
  );

  const profile5 = await profiles.createProfile(
    extractUserId4,
    "Alen",
    "peter",
    "Male",
    image,
    "www.Alen.com",
    "www.youtube.com/Alen",
    "America 14 street",
    "America 14 street",
    "New York",
    "Alaska",
    "America",
    "99501",
    "Interest in Web3"
  );

  //events

  // filename
  // thumbnail_1_1671355906789_pexels-josh-sorenson-976866.jpg
  const Eventimage = {
    fieldname: "avatar",
    originalname: "abc.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    destination: "public/uploads/events",
    filename: "abc.jpg",
    path: "public\\uploads\\events\\abc.jpg",
    size: 3031502,
  };
  const event1 = await events.createEvent(
    extractId,
    "Stevens EVENT",
    "Bright students Festival",
    "Interact and Explore with young generation minds.",
    "Back-end",
    // 'abc.jpg, abc.jpg, abc.jpg, abc.jpg',
    'abc.jpg', 'abc.jpg','abc.jpg','abc.jpg',
    "#WEB3,#QUANTUM",
    "India",
    "75"
  );
  const event2 = await events.createEvent(
    extractId2,
    "GDSC EVENT 2022",
    "This is overview",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Front-end",
    // 'abc.jpg, abc.jpg, abc.jpg, abc.jpg',
    'abc.jpg', 'abc.jpg','abc.jpg','abc.jpg',
    "#React",
    "Germany",
    "66"
  );
  const event3 = await events.createEvent(
    extractId3,
    "DevFest 2022",
    "This is overview",
    "Explore Google technologies, connect with developers, and engage with experts..",
    "Front-end",
    // "abc.jpg, abc.jpg, abc.jpg, abc.jpg",
    'abc.jpg', 'abc.jpg','abc.jpg','abc.jpg',

    "#DevFest",
    "Germany",
    "55"
  );
  const event4 = await events.createEvent(
    extractUserId3,
    "Kick Start",
    "This is overview",
    "Join a global coding competition for all skill levels.",
    "Back-end",
    // "abc.jpg, abc.jpg, abc.jpg, abc.jpg",
    'abc.jpg', 'abc.jpg','abc.jpg','abc.jpg',

    "#KickStart",
    "Virtual",
    "70"
  );
  const event5 = await events.createEvent(
    extractUserId4,
    "Women in ML Symposium 2022",
    "This is overview",
    "Catch up on the latest machine learning tools, techniques, and products by Google",
    "Back-end",
    // "abc.jpg, abc.jpg, abc.jpg, abc.jpg",
    'abc.jpg', 'abc.jpg','abc.jpg','abc.jpg',
    "#WIMLsymposium",
    "Virual",
    "80"
  );

  //reports
  const report1 = reports.createReport(
    extractId,
    "KshitijChaudhari",
    extractId2,
    "Violent or repulsive content"
  );
  const report2 = reports.createReport(
    extractId3,
    "KshitijChaudhari",
    extractId2,
    "Violent or repulsive content"
  );
  const report3 = reports.createReport(
    extractId4,
    "KshitijChaudhari",
    extractId2,
    "Violent or repulsive content"
  );
  const report4 = reports.createReport(
    extractUserId3,
    "KshitijChaudhari",
    extractId2,
    "Violent or repulsive content"
  );
  const report5 = reports.createReport(
    extractUserId4,
    "KshitijChaudhari",
    extractId2,
    "Violent or repulsive content"
  );

  //comments
  const comment1 = comments.createComment(
    extractUserId4,
    event1,
    "KshitijChaudhari",
    null,
    "Awesome"
  );
  const comment2 = comments.createComment(
    extractUserId4,
    event1,
    "KshitijChaudhari",
    null,
    "Excited"
  );
  const comment3 = comments.createComment(
    extractUserId4,
    event1,
    "KshitijChaudhari",
    null,
    "Awesome"
  );
  //followers

  const follow1 = followers.createFollowers(extractId, extractUserId3);
  const follow2 = followers.createFollowers(extractId, extractUserId3);

  return "Done seeding database";
}

main()
  .then((res) => console.log(res))
  .catch((err) => {
    console.log(err);
  });
