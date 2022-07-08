import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Router, Request, Response } from 'express';
import fs from "fs";


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get('/filteredimage',
      async (req: Request, res: Response) => {
          console.log('inside: ')
          let { image_url } = req.query.image_url;
          filterImageFromURL(req.query.image_url).then(output => {
            res.status(200).sendFile(output)
          }).catch(err => {
            res.status(422).send(err)
          }).finally(() => {
            //get all the files located in
            fs.readdir(__dirname + "/util/tmp/", (err,filenames) => {

                    if (filenames.length > 0) {
                        let abs_files = filenames.map(k => {
                          return __dirname + "/util/tmp/" + k
                        })
                        deleteLocalFiles(abs_files).then(out => console.log(out))
                    }
                  })

          });
  });




  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
