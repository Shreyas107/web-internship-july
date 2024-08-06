router.post(
  "/assign-task",
  authorizeRole(["coordinator"]),
  (request, response) => {
    const {
      course_name,
      subject_name,
      group_name,
      staff_name,
      from_date,
      till_date,
    } = request.body;

    console.log("/assign-task req.body ", request.body);

    // Check if the course exists
    const courseQuery = `SELECT course_id FROM ${COURSE_TABLE} WHERE course_name = ?`;
    db.execute(courseQuery, [course_name], (courseError, courseResult) => {
      if (courseError) {
        response
          .status(500)
          .send(utils.createErrorResponse(courseError.message));
        return;
      }

      if (courseResult.length === 0) {
        response
          .status(404)
          .send(utils.createErrorResponse("Course not found"));
        return;
      }

      const course_id = courseResult[0].course_id;
      console.log("courseId ", course_id);

      // Check if the subject exists
      const subjectQuery = `SELECT subject_id FROM ${SUBJECT_TABLE} WHERE subject_name = ?`;
      db.execute(
        subjectQuery,
        [subject_name],
        (subjectError, subjectResult) => {
          if (subjectError) {
            response
              .status(500)
              .send(utils.createErrorResponse(subjectError.message));
            return;
          }

          if (subjectResult.length === 0) {
            response
              .status(404)
              .send(utils.createErrorResponse("Subject not found"));
            return;
          }

          const subject_id = subjectResult[0].subject_id;
          console.log("subId", subject_id);

          // Check if the group exists
          const groupQuery = `SELECT group_id FROM ${GROUP_TABLE} WHERE group_name = ?`;
          db.execute(groupQuery, [group_name], (groupError, groupResult) => {
            if (groupError) {
              response
                .status(500)
                .send(utils.createErrorResponse(groupError.message));
              return;
            }

            if (groupResult.length === 0) {
              response
                .status(404)
                .send(utils.createErrorResponse("Group not found"));
              return;
            }

            const group_id = groupResult[0].group_id;
            console.log("groupId", group_id);

            // Check if the staff exists
            const staffQuery = `SELECT staff_id FROM ${STAFF_TABLE} WHERE staff_name = ?`;
            db.execute(staffQuery, [staff_name], (staffError, staffResult) => {
              if (staffError) {
                response
                  .status(500)
                  .send(utils.createErrorResponse(staffError.message));
                return;
              }

              if (staffResult.length === 0) {
                response
                  .status(404)
                  .send(utils.createErrorResponse("Staff not found"));
                return;
              }

              const staff_id = staffResult[0].staff_id;
              console.log("staffId", staff_id);

              // Fetch all student IDs belonging to the group
              const studentQuery = `SELECT student_id FROM ${STUDENT_TABLE} WHERE group_id = ?`;
              console.log("studentQuery", studentQuery);

              db.execute(
                studentQuery,
                [group_id],
                (studentError, studentResult) => {
                  if (studentError) {
                    response
                      .status(500)
                      .send(utils.createErrorResponse(studentError.message));
                    return;
                  }

                  // Check if any students were found in the group
                  if (studentResult.length === 0) {
                    response
                      .status(404)
                      .send(
                        utils.createErrorResponse(
                          "No students found in the group"
                        )
                      );
                    return;
                  }

                  // Extract student IDs from the result
                  console.log("studentResult ", studentResult);

                  const studentIds = studentResult.map(
                    (student) => student.student_id
                  );
                  // console.log("studentIds ", student.student_id);

                  // Insert data into MarksEntry table for each student
                  const insertQuery = `INSERT INTO ${MARKS_ENTRY_TABLE}
                    (student_id, subject_id, group_id, course_id, staff_id)
                    VALUES (?, ?, ?, ?, ?)`;

                  // Create an array of arrays containing values for each student
                  const values = studentIds.map((studentId) => [
                    studentId,
                    subject_id,
                    group_id,
                    course_id,
                    staff_id,
                  ]);

                  console.log("insertQuery ", insertQuery);

                  // Execute the insert query for each set of values
                  values.forEach((valueSet, index) => {
                    db.execute(
                      insertQuery,
                      valueSet,
                      (insertError, insertResult) => {
                        if (insertError) {
                          console.error(
                            `Error inserting data for student ${studentIds[index]}: ${insertError.message}`
                          );
                        } else {
                          console.log(
                            `Data inserted successfully for student ${studentIds[index]}`
                          );
                        }
                      }
                    );
                  });

                  // Send success response
                  response.send(
                    utils.createSuccessResponse(
                      "Task assigned successfully for all students in the group"
                    )
                  );
                }
              );
            });
          });
        }
      );
    });
  }
);
