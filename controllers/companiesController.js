/**
 * Gets companies list
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.get = async (req, res) => {
    let companies = await Companies.findAll();
    res.json(companies);
};

/**
 * Get one company
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getOne = async (req, res) => {
    const data = req.query;
    let companies = await Companies.findOne(
        {
            attributes: ['id', 'name', 'type_id'],
            where: {id: data.id}
        }
    );
    res.json(companies);
};

/**
 * Adds a new company
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.add = async (req, res) => {


    // Getting validation result from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array()[0]);
    }

    let data = req.body;
    let result = await Companies.create(data);
    res.json(result)
};


/**
 * Removes a company
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.remove = async (req, res) => {
    let data = req.query;
    await Companies.destroy({where: {id: data.id}});
    this.get(req, res);
};


/**
 * Updates a company info
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {

    // Getting validation result from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array()[0]);
    }

    let data = req.body;
    let id = data.id;
    delete data.id;
    await Companies.update(data, {where: {id: id}});
    this.get(req, res);
};