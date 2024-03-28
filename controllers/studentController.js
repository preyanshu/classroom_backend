const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Student = require("../models/Student");

exports.submitAssignment = async (req, res) => {
    try {
        const { studentName, assignmentId } = req.body;
        const student = await Student.findOne({ name: studentName });
        const assignment = await Assignment.findById(assignmentId);

        if (!student || !assignment) {
            return res.status(404).json({ error: "Student or Assignment not found" });
        }

        // Ensure the 'students' array is initialized
        if (!assignment.students) {
            assignment.students = [];
        }

        assignment.students.push(student);
        await assignment.save();

        // Ensure the 'assignments' array is initialized
        if (!student.assignments) {
            student.assignments = [];
        }

        student.assignments.push(assignment);
        await student.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.viewAssignments = async (req, res) => {
    try {
      const { emailid } = req.params;
  
      // Find the student document by email to get its ObjectId
      const student = await Student.findOne({ email: emailid });
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      const studentId = student._id;
  
      // Find the class(es) in which the student is enrolled
      const classes = await Class.find({ students: studentId });
  
      // Collect the IDs of these classes
      const classIds = classes.map(classData => classData._id);
  
      // Find all assignments where the class ID exists in the classIds array
      const assignments = await Assignment.find({ class: { $in: classIds } }).populate({
        path: 'class',
        select: 'subjectCode'
      });
  
      res.json(assignments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

exports.updateStudentInfo = async (req, res) => {
    try {
        const { name, semester, rollNo, branch } = req.body;
        const studentId = req.student._id;

        const updatedInfo = {};
        if (name) updatedInfo.name = name;
        if (semester) updatedInfo.semester = semester;
        if (rollNo) updatedInfo.rollNo = rollNo;
        if (branch) updatedInfo.branch = branch;

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedInfo, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};