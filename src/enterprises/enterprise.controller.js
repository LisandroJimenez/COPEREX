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
        const { limit = 10, since = 0, sort = "name", order = "asc", category, yearsExperience } = req.query;

        const filters = {};
        if (category) {
            filters.category = category; 
        }
        if (yearsExperience) {
            filters.yearsExperience = { $gte: yearsExperience }; 
        }

        const sortOrder = order === "desc" ? -1 : 1; 
        const enterprises = await Enterprise.find(filters)
            .skip(Number(since))
            .limit(Number(limit))
            .sort({ [sort]: sortOrder });

        const total = await Enterprise.countDocuments(filters);

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