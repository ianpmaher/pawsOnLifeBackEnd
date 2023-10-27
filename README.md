# PawsOn.Life #

This React JS app is built on the idea that we all need to take a pause on life to enjoy the natural world around us, and who better to share it with than our four-legged companions.  PawsOn.Life utilizes the Google Maps Platform to help find local hiking trails nearby while also providing crowd-sourced information about the trails.  Users can create an account, add ratings, identify amenities, and save their favorite hiking trails.  Overall, the app is designed to better prepare you and your pet for your next adventure.

#catshavepawstoo
#solvingglobalwarmingonepawatatime
#nobootstrapusedhere

## Installing ##

* Fork this repository
* Clone your forked repository
* npm i

Note for Frontend
* Will need to generate own API for Google Places API - https://developers.google.com/maps/documentation/javascript/get-api-key

## Approach ##

Our backend utilizes the Express built-in server, along with MongoDB as our database, managed using Mongoose.  CORS middleware is implemented using the CORS package to handle requests coming from different origins to control access to our resources.  We also employ bcrypt for password hashing and the jsonwebtoken library to authenticate and authorize user access.  Additionally, we’ve incorporated Nodemailer to enable email functionally within our app, enhancing user communication and interaction.

On our frontend we utilize React and React DOM for our user interface to ensure a dynamic and responsive app with smooth navigation between pages.  For styling, we rely on Material-UI, Emotion and Styled Components, giving us the flexibility to create beautiful and customizable designs.  Google Maps functionality with Autocomplete and Google Places API are integrated for location-based features.

## User Stories ##
* As a hiker, I want to view data about trails around me so that I can find new favorites.
* As a pet owner, I want to bring my dog/cat on trails safely.
* As a pet owner & hiker, I want to have a community of other hikers who like to bring their doggs/kitties on hikes.
* As a pet owner & pet owner, I want to approximate how much water to bring along for my pet.
* As a pet owner, I want to know which trails are considered pet-friendly and which have been reviewed poorly.
* As Gore, I want to solve global warming.

## Planned Features ##
* History Page and Favorites page based on user selection
* Install “react-swipeable-views” that would allow users to switch between tabs displayed in a certain way.
* Dog API to help populate breed of work for dog profiles.
* Create a Reviews section where users can leave comments about the trail and post pictures of the hike.
* #tags – allow users to tag keywords on trails they have hike to be displaying with the trail info.

## Helpful Links ##

Live Site        | www.pawson.life:4012
-------------    | -------------
GitHub backend   |  https://github.com/ianpmaher/pawsOnLifeBackEnd
GitHub frontend  |  https://github.com/ianpmaher/pawsOnLifeFrontEnd

## Authors ##
Ian Maher  
Richard Weeks  
Singa Cao
