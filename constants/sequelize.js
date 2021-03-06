global.db = require('../models');
global.Users = db.users;
global.UsersStatuses = db.users_statuses;
global.sequelize = require('sequelize');
global.Roles = db.roles;
global.Ferries = db.ferries;
global.Tours = db.tours;
global.ToursType = db.tours_type;
global.PartnerTypes = db.partner_types;
global.FoodDrink = db.food_drink;
global.Activities = db.activities;
global.ActivityTypes = db.activity_types;
global.ActivitySubTypes = db.activity_subtypes;
global.ActivitiesTypes = db.activities_act_types;
global.Accommodations = db.accommodations;
global.Companies = db.companies;
global.Contacts = db.contacts;
global.Positions = db.positions;
global.Locations = db.locations;
global.Ratings = db.ratings;
global.FerryDirections = db.ferries_directions;
global.FerryDirectionsPricing = db.ferry_directions_pricings;
global.FerryRoutesCoordinates = db.ferry_routes_coordinates;
global.AccommodationOrders = db.accommodation_orders;
global.ActivitiesOrders = db.activities_orders;
global.ToursOrders = db.tours_orders;
global.ToursDailies = db.tours_dailies;
global.TourLocations = db.tours_locations;
global.Op = sequelize.Op;
