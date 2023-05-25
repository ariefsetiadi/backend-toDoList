import TaskStatus from "../models/TaskStatusModel.js";

export const getAllTaskStatus = async (req, res) => {
  try {
    const taskStatus = await TaskStatus.findAll({
      order: [["order", "ASC"]],
    });
    res.json(taskStatus);
  } catch (error) {
    res.json({ msg: "Get task status is failed" });
  }
};

export const getTaskStatusById = async (req, res) => {
  try {
    const taskStatus = await TaskStatus.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!taskStatus)
      return res.status(404).json({ msg: "Task Status not found" });

    res.status(200).json(taskStatus);
  } catch (error) {
    res.status(400).json({ msg: "Something wrong" });
  }
};

export const saveAllTaskStatus = async (req, res) => {
  const { name_status, order, status } = req.body;
  // Check duplicate name_status
  const checkName = await TaskStatus.findOne({
    where: {
      name_status: name_status,
    },
  });

  if (checkName) {
    return res.status(409).json({ msg: "Name status already used" });
  }

  // Check duplicate order
  const checkOrder = await TaskStatus.findOne({
    where: {
      order: order,
    },
  });

  if (checkOrder) {
    return res.status(409).json({ msg: "Order already used" });
  }

  try {
    await TaskStatus.create({
      name_status: name_status,
      order: order,
      status: status,
    });

    res.json({ msg: "Save task status is success" });
  } catch (error) {
    res.json({ msg: "Save task status is failed" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const taskStatus = await TaskStatus.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!taskStatus) {
    return res.status(404).json({ msg: "Task Status not found" });
  }

  // Check duplicate name_status
  const checkName = await TaskStatus.findOne({
    where: {
      name_status: req.body.name_status,
    },
  });

  if (checkName && checkName.id != req.params.id) {
    return res.status(409).json({ msg: "Name status already used" });
  }

  // Check duplicate order
  const checkOrder = await TaskStatus.findOne({
    where: {
      order: req.body.order,
    },
  });

  if (checkOrder && checkOrder.id != req.params.id) {
    return res.status(409).json({ msg: "Order already used" });
  }

  try {
    await TaskStatus.update(
      {
        name_status: req.body.name_status,
        order: req.body.order,
        status: req.body.status,
      },
      {
        where: {
          id: taskStatus.id,
        },
      }
    );
    res.json({ msg: "Update task status is success" });
  } catch (error) {
    res.json({ msg: "Update task status is failed" });
  }
};
