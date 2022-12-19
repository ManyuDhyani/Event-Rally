# Event-Rally

## **How To the Project**
- **Step 1: clone the remote repository by: git clone https://github.com/ManyuDhyani/Event-Rally.git**
- **Step 2: In termonal: npm install**
- **Step 3: Then for seeding the database by sample data: node ./task/seed.js**
- **Step 4: The finally run script: npm start**

## **Link to: Final Project Walkthroug Presentation**
https://drive.google.com/file/d/102rkHDsZ_wIVc6qXUlX3jOFURK6THiyI/view?usp=sharing

## **Dependencies**
        "axios": "^1.2.1",
        "bcrypt": "^5.1.0",
        "bcryptjs": "^2.4.3",
        "dotenv": "^16.0.3",
        "express": "^4.18.2",
        "express-handlebars": "^6.0.6",
        "express-session": "^1.17.3",
        "handlebars": "^4.7.7",
        "mongodb": "^4.12.1",
        "multer": "^1.4.5-lts.1",
        "seed": "^0.4.4",
        "xss": "^1.0.14"
       
## **Final Project Proposal After Approval**
- **Core Feature**
1. Landing Page
● Explains the purpose and motivation of the service.
● Display the Trending Events.
● Displays the Latest Events.
2. NavBar
● Search Bar
● Filters: Filter by Event Type or Location
3. Event Detail Page
● Full Event details with attributes like Price, People Attending, People
Following the event, Likes, Tags, Location and Time.
● Comment Section associated with Event detail page.
4. Guest User
● Check out the Trending and Latest Events.
● Check out the Event Detail Page.
5. Registered User
● User Profile Page: Shows the Event created by the user, if any with their
username and profile picture.
● User Settings Page: Shows user’s account details and user can update
them, including Profile Picture, username, email address and password.
● User Feed Page: Shows the event which the user follows or buyed ticket
for (attending), or in his/her city.
6. Event Creation Page
● Creating Event, or updating details for the same
7. Deletion by User
● Users can delete the created Event.
● Users can delete his/her comment.
8. Tags:
● User can get events with similar tag by clicking on different tags mention in
the current event detail page user is viewing (ex: #Concert). Tags will be
case-insensitive.
- **Core Feature which Professor asked us to move from extra to core**
I will approve with the following conditions. you move the following from extra features to core features:
9. Recommending the similar event based on similar category or tags.
10. Show map for the valid event locations.
11. Report system for event, comment and user. Make an admin account to monitor event reports or reports against fake users, comments, etc.
12. Follow/Unfollow other users. If followed then the user can see the following user events in their feed as well. 
13. You should also allow users who create events to upload a photo in the details.

- **Extra Feature**
<br>Note: The serial number of extra feature is same from the original proposal pdf so that you can know which 3 we executed. We mentioned here only which executed.

- ** Fully Functioning **
1. Statistics: Give stats about user attending vs following the event, like vs dislike
for the event, male vs female ratio in the event, etc using pie, or doughnut graph
according to usage.
8. Moreover, Admin accounts make a host a verified host if he/she has done more
than 4 events successfully, by giving them a blue tick.

- ** Partail**
2. Twitter tweets for hashtag #Event shown in Landing page. Efforts will be made to
incorporate more variety of hashtags feed related to topic like #ConcertEvent,
#TechEvent, etc.



