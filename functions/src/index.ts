import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Busboy from "busboy";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage().bucket();

export const userFilesFunction = functions.https.onRequest(
  async (req, res): Promise<void> => {
    try {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized");
        return;
      }

      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userId = decodedToken.uid;

      const busboy = Busboy({ headers: req.headers });
      const uploadedFiles: string[] = [];
      const filePromises: Promise<void>[] = [];

      busboy.on(
        "file",
        (fieldname: string, file: Readable, filename: string, encoding: string, mimetype: string) => {
          const filepath = `users/${userId}/${uuidv4()}-${filename}`;
          const fileRef = storage.file(filepath);

          const writeStream = fileRef.createWriteStream({
            metadata: { contentType: mimetype },
          });

          const uploadPromise = new Promise<void>((resolve, reject) => {
            file.pipe(writeStream)
              .on("finish", async () => {
                try {
                  await db.collection("files").add({
                    name: filename,
                    userId,
                    path: filepath,
                    type: mimetype,
                    uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
                    url: `gs://${storage.name}/${filepath}`,
                  });
                  uploadedFiles.push(filename);
                  resolve();
                } catch (err) {
                  reject(err);
                }
              })
              .on("error", (err) => reject(err));
          });

          filePromises.push(uploadPromise);
        }
      );

      busboy.on("finish", async () => {
        try {
          await Promise.all(filePromises);
          res.status(200).json({ uploadedFiles });
        } catch (err) {
          console.error("Upload error:", err);
          res.status(500).send("Upload failed");
        }
      });

      req.pipe(busboy);
    } catch (error) {
      console.error("Function error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);