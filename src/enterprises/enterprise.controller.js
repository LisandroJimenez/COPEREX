import Enterprise from "./enterprise.model.js";

export const saveEnterprise = async (req, res) => {
    try {
        const data = req.body;
        const enterprise = new Enterprise ({
            ...data
        })
        await enterprise.save();
        res.status(200).json({
            success: true,
            msg: 'Enterprise saved successfully',
            enterprise
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error saving enterprise',
            error
        })
    }
}

export const getEnterprise = async (req, res) => {
    try {
        const { limit = 10, since = 0, order, category} = req.query;

        let filters = {};
        
        if (category) {
            filters.category = { $regex: new RegExp(category, 'i') };        }
        
        let query = Enterprise.find(filters).skip(Number(since)).limit(Number(limit));
        
        if (order === "years") {
            query = query.sort({ yearsExperience: -1 });
        }

        if (order === "asc") {
            query = query.sort({ name: 1 }); 
        }

        if (order === "desc") {
            query = query.sort({ name: -1 });
        }

        const enterprises = await query;
        const total = await Enterprise.countDocuments({});

        res.status(200).json({
            success: true,
            total,
            enterprises
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error fetching enterprises',
            error
        });
    }
};


export const updateEnterprise = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, impactLevel, ...data} = req.body;
        
        const validImpactLevels = ["Professional", "Semiprofessional", "Amateur"];
        if (impactLevel && !validImpactLevels.includes(impactLevel)) {
            return res.status(400).json({
                success: false,
                msg: `Invalid impactLevel. Allowed values: ${validImpactLevels.join(", ")}`
            });
        }

        if (impactLevel) {
            data.impactLevel = impactLevel;
        }

        const enterprise = await Enterprise.findByIdAndUpdate(id, data, {new: true});
        if (!enterprise) {
            return res.status(404).json({
                success: false,
                msg: 'Enterprise not found'
            })
        }
        res.status(200).json({
            success: true,
            msg: 'Enterprise Updated Successfully',
            enterprise
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error updatting Enterprise',
            error
        })
    }
}