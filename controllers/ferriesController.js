require('../constants/sequelize');

const {promisify} = require('util');
const readdir = promisify(require('fs-extra').readdir);
const unlink = promisify(require('fs-extra').unlink);

const ferryRoutes = require('../mongoose/ferry_routes');


/**
 * Gets all ferries list
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.get = async (req, res) => {
    const data = req.query;
    let partner_id = data.partner_id;

    let wherePartner = {where: (partner_id ? {partner_id: data.partner_id} : {}), include: {model: Companies}};
    const result = await to(Ferries.findAll(wherePartner));

    if (!res.headersSent) {
        res.json(result);
    }
};

/**
 * Gets ferry partners list
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getPartners = async (req, res) => {

    const partners = await to(Users.findAll({
        include: [
            {model: PartnerTypes, where: {name: 'Ferries'}}
        ]
    }));

    res.json(partners);
};

/**
 * Gets one ferry info
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
    let data = req.query;
    let result = await to(Ferries.findOne({
        where: {id: data.id},
        include: [
            {model: Companies, attributes: ['id', 'name']}
        ]
    }));


    let r = await getOneItemImages(req, FERRIES_UPLOAD_FOLDER, result);
    // if (!res.headersSent) {
    res.json(r);
    // }
};

/**
 * Adds a new ferry
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.add = async (req, res) => {

    let data = req.body;
    uploadImages(req, res, async (err) => {

        // Getting validation result from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array()[0]);
        }

        if (!showIfErrors(req, res, err)) {
            await Ferries.create(data);
            this.get(req, res)
        }
    })

};


/**
 * Removes a ferry info
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
    let data = req.query;
    await Ferries.destroy({where: {id: data.id}});
    this.get(req, res);
};


exports.removeImage = async (req, res) => {
    let data = req.query;

    if (fse.existsSync(data.folder)) {
        // console.log(data.folder)
        console.log(FERRIES_UPLOAD_FOLDER)
        // Do something
        let files = await readdir(data.folder);

        files.map((async (file) => {
            if (file === data.file) {

                // console.log(file)
                await unlink(path.join(data.folder, file));

                this.getOne(req, res);
            }
        }));

        // if (!res.headersSent) {
        //     res.json('');
        // }
    }
};

/**
 * Updates a ferry info
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {

    let data = req.body;

    // Renaming folder if name is changed
    if (data.oldName !== data.name) await renameFolder(data.oldName, data.name, FERRIES_UPLOAD_FOLDER);


    uploadImages(req, res, async (err) => {

        // Getting validation result from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json(errors.array()[0]);
        }


        if (!showIfErrors(req, res, err)) {


            let id = data.id;
            delete data.id;
            delete data.img;
            await Ferries.update(data, {where: {id: id}});
            this.get(req, res);
        }
    })
};


exports.makeCover = async (req, res) => {
    let data = req.body;
    await Ferries.update({img: data.img}, {where: {id: data.id}});
    res.json("OK")
};

exports.assignDriver = async (req, res) => {
    let data = req.body;
    await Ferries.update({driver_id: data.driver_id}, {where: {id: data.ferry_id}});
    res.json("OK")
};

exports.getFerriesDirections = async (req, res) => {
    let data = req.query;
    let directions = await FerryDirections.findAll({
        attributes: ['id', 'name', 'latitude', 'longitude'],
        raw: true,
        order: ['name']
    });


    // For order form mat-select
    if (data.dropdown) {

        directions.map(d => {
            d['coordinates'] = {latitude: d.latitude, longitude: d.longitude};
            delete d.latitude;
            delete d.longitude;
        });
    }
    res.json(directions);
};


exports.getFerriesDirectionsPrices = async (req, res) => {
    let data = req.query;
    console.log('here!!!!!!!!!')
    let pricing = await FerryDirectionsPricing.findAll({
        include: [{model: FerryRoutesCoordinates, as: 'coordinates'}],
        order: [['start_point', 'asc'], [sequelize.col(`coordinates.id`), 'asc']]
    });
    res.json(pricing);
};


exports.getFerryDirectionPrice = async (req, res) => {
    let data = req.query;
    let pricing = await FerryDirectionsPricing.findAll(
        {
            where: {
                start_point: data.start_point,
                stop_1: data.stop_1,
                stop_2: data.stop_2,
                end_point: data.start_point
            }
        }
    );
    res.json(pricing);
};


exports.getRealLocations = async (req, res) => {
    // const options = {
    //     //     hostname: 'curl \'http://www.marinetraffic.com/ais/getjson.aspx?sw_x=0&sw_y=70&ne_x=30&ne_y=80&zoom=6&fleet=&station=0&id=null\' -H \'Referer: http://www.marinetraffic.com/ais/\'',
    //     // };
    //     // const curl = request(options.hostname, (res) => {
    //     //     console.log(res)
    //     // })

    // const { curly } = require('node-libcurl');

    const {statusCode, data, headers} = await curly.get('http://www.marinetraffic.com/ais/getjson.aspx?sw_x=0&sw_y=70&ne_x=30&ne_y=80&zoom=6&fleet=&station=0&id=null')

    console.log(statusCode, data)
};


exports.addLocation = async (req, res) => {
    await FerryDirections.create(req.body)
    this.getFerriesDirections(req, res);
};

exports.updateLocation = async (req, res) => {
    let data = req.body;
    console.log(data)
    await FerryDirections.update(data, {where: {id: data.id}});
    this.getFerriesDirections(req, res);
};

exports.removeLocation = async (req, res) => {
    let data = req.query;
    console.log(data)
    let found = await ferryRoutes.findOne({
        $or: [
            {start_point: data.name},
            {end_point: data.name}
        ]
    });
    if (!found) {
        await FerryDirections.destroy({where: {id: data.id}});
        this.getFerriesDirections(req, res);
    } else {
        res.status(500).json({
            msg: 'Please remove the routes with the current location name first.',
            main: 'This location listed in route list!'
        });
    }
};


/**
 * Removes a selected ferries gallery image
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.removeImage = async (req, res) => {
    await removeImage(req.query, res);
};

exports.importJSONFile = async (req, res) => {
    let d = req.body;
    await FerryDirectionsPricing.destroy({
        where: {},
        truncate: true
    });
    let list = d.map(async (data) => {
        // let found = await FerryDirectionsPricing.findOne({
        //     where: {
        //         start_point: data.start_point,
        //         stop_1: data.stop_1,
        //         stop_2: data.stop_2,
        //         end_point: data.end_point
        //     }
        // });

        // console.log('found' + found)

        // if (found === null) {
        console.log('importing!!!!')
        let f = await FerryDirectionsPricing.create(data);
        data.coordinates.map(c => {
            c.ferry_route_id = f.id;
        });
        await FerryRoutesCoordinates.bulkCreate(data.coordinates);
        // } else {
        //     data.coordinates.map(c => {
        //         c.ferry_route_id = found.id;
        //     });
        //     await FerryRoutesCoordinates.bulkCreate(data.coordinates);
        //
        // }

    });
    await Promise.all(list);
    console.log('here')
    this.getFerriesDirectionsPrices(req, res);
};

exports.importPricesFile = async (req, res) => {
    let d = req.body;

    let list = d.map(async (data) => {
        let found = await FerryDirectionsPricing.findOne({
            where: {
                start_point: data.start_point,
                stop_1: data.stop_1,
                stop_2: data.stop_2,
                end_point: data.end_point
            }
        });

        if (!found) {
            const startPoint = data.start_point;
            const stop1 = data.stop_1;
            const stop2 = data.stop_2;
            const endPoint = data.end_point;
            let name = `${startPoint ? startPoint : ''}${stop1 ? ' - ' + stop1 : ''}${stop2 ? ' - ' + stop2 : ''}${endPoint ? ' - ' + endPoint : ''}`;
            let f = await FerryDirectionsPricing.create({...data, name});
        }
    });
    await Promise.all(list);
    this.getFerriesDirectionsPrices(req, res);
};


exports.addRoutePrice = async (req, res) => {
    const data = req.body;
    console.log('LENGTH:!!!!!', data.length)
    if (!showIfErrors(req, res)) {
        // await to(FerryDirectionsPricing.create(data));
        this.getFerriesDirectionsPrices(req, res);
    }
};

exports.updateRoutePrice = async (req, res) => {
    const data = req.body;
    if (!showIfErrors(req, res)) {
        await to(FerryDirectionsPricing.update(data, {where: {id: data.id}}));
        this.getFerriesDirectionsPrices(req, res);
    }
};


exports.removeRoutePrice = async (req, res) => {
    await to(ferryRoutes.remove({_id: req.query._id}));
    this.getAllRoutesPrices(req, res);
    // await to(FerryDirectionsPricing.destroy({where: {id: req.query.id}}));
    // this.getFerriesDirectionsPrices(req, res);
};

exports.removeAllRoutesPrices = async (req, res) => {
    await to(FerryDirectionsPricing.destroy({
        where: {},
        truncate: true
    }));
    await to(FerryRoutesCoordinates.destroy({
        where: {},
        truncate: true
    }));
    this.getFerriesDirectionsPrices(req, res);
};


exports.getRoutePrice = async (req, res) => {
    let data = req.body;
    console.log(data)

    let route = await this.buildConditionAndCheck(data);
    // console.log(whereRoute)
    // console.log(!route || route.coordinates.length === 0)
console.log('route!!!')
    console.log(route.dataValues)
    console.log(route)
    // res.json(route);
console.log('route!!!')

    if (!route || (route.length > 0 && route[0].coordinates.length === 0)) {
        let reversedRoute = await this.buildConditionAndCheck(data.reverse(), true);
        if (!reversedRoute) {
            res.status(444).json({msg: 'The selected route is not found'});
        } else {
            res.json(reversedRoute);
        }
    } else res.json(route);
};

exports.buildConditionAndCheck = async (data, reversed = false) => {
    // console.log(data)
    let condition = {stop_1: '', stop_2: ''};

    condition.start_point = data[0].name;
    if (data.length === 2) {
        condition.end_point = data[1].name;
    } else if (data.length === 3) {
        condition.stop_1 = data[1].name;
        condition.end_point = data[2].name;
    } else if (data.length === 4) {
        condition.stop_1 = data[1].name;
        condition.stop_2 = data[2].name;
        condition.end_point = data[3].name;
    }


    // console.log(condition)

    let dt = await FerryDirectionsPricing.findAll({
        include: [{model: FerryRoutesCoordinates, as: 'coordinates'}],
        order: [['start_point', 'asc'], [sequelize.col('`coordinates`.`id`'), 'asc']],
        where: condition
    });


    if (reversed && dt && dt.coordinates) {
        console.log('reversed!!!!')
        dt.coordinates = dt.coordinates.reverse();
    }
    // console.log('!!!!!!!')
    // console.log(dt[0])
    // console.log('!!!!!!!')
    return dt;
}

// exports.getAllRoutes = async (req, res) => {
//     // let dt = await ferryRoutes.find({coordinates: {$exists: true, $not: {$size: 0}}}, {}).sort({'start_point': 1});
//     // // .select({
//     // // "name": 1,
//     // // "geometry_type": 1,
//     // // "coordinates": 1
//     // // // "coordinates.lat": 1,
//     // // // "coordinates.lng": 1,
//     // //
//     // // });
//     // res.json(dt);
// };
//
//
// exports.getAllRoutesPrices = async (req, res) => {
//     let dt = await ferryRoutes.find({}).sort({'start_point': 1});
//     // .select({
//     // "name": 1,
//     // "geometry_type": 1,
//     // "coordinates": 1
//     // // "coordinates.lat": 1,
//     // // "coordinates.lng": 1,
//     //
//     // });
//     res.json(dt);
// };



