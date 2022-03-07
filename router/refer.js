//after authentication - home route
router.get("/home", protect, (req, res) => {
  res.render("home", {
    name: req.user.rows[0].name,
    link: req.user.rows[0].link,
    email: req.user.rows[0].email,
  });
});

//invite route
router.post("/invite", (req, res) => {
  //   sending patient details
  var patientdetails = {
    PatientName: req.body.PatientName,
    Age: req.body.Age,
    Gender: req.body.Gender,
    AttendentName: req.body.AttendentName,
    MobileNumber: req.body.MobileNumber,
    Category: req.body.Category,
    Hospital: req.body.Hospital,
    ServiceType: req.body.ServiceType,
    Description: req.body.Description,
  };

  (receiverId = req.body.to), (senderName = req.body.name);
  let current = new Date().toISOString();
  client.query(
    `INSERT INTO invitations (created_at,updated_at, senderId,patientdetails,senderName,receiverId) VALUES ('${current}','${current}','${senderId}','${patientdetails}','${senderName}','${receiverId}')`,
    (err, result) => {
      if (err) {
        return console.log(err);
      } else {
        sendEmail(receiverId, senderId);
        res.send("invited");
      }
    }
  );
});

// / user invitations
router.get("/myInvitations", (req, res) => {
  let link = req.query.link;
  console.log(link);
  client.query(
    `SELECT * from invitations where senderId='${link}'`,
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        res.status(200).send(doc.rows);
      }
    }
  );
});

router.get("/invite/:id", (req, res) => {
  console.log(req.params);
  let sender = req.params.id.trim().split("-")[0].trim();
  let inviteLink = req.params.id.trim().split("-")[1].trim();
  console.log(sender);
  console.log(inviteLink);
  client.query(
    `SELECT * FROM invitations WHERE senderid='${sender}' AND link='${inviteLink}'`,
    (err, doc) => {
      if (err) {
        return console.log(err);
      } else {
        let seen = new Date().toISOString();
        client.query(
          `UPDATE invitations SET updated_at='${seen}' WHERE senderid='${sender}' AND link='${inviteLink}'`,
          (err, doc) => {
            if (err) {
              return console.log(err);
            } else {
              console.log("seen updated");
            }
          }
        );
        console.log(doc.rows);
        res.render("invite", { result: doc.rows[0] });
      }
    }
  );
});
