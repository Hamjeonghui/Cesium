package com.ham;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@RestController
@RequestMapping("/osm_tiles2")
@CrossOrigin(origins = {
        "http://localhost:8089",
        "http://<ip>:8089"
})
public class TileController {

    @GetMapping("/{z}/{x}/{y}.png")
    public ResponseEntity<byte[]> proxyTile(
            @PathVariable String z,
            @PathVariable String x,
            @PathVariable String y
    ) {
        String gisUrl = "http://<geoserver>/osm_tiles2/" + z + "/" + x + "/" + y + ".png";

        try {
            URL url = new URL(gisUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            if (conn.getResponseCode() == 200) {
                InputStream inputStream = conn.getInputStream();
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();

                byte[] data = new byte[1024];
                int nRead;
                while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, nRead);
                }

                buffer.flush();
                byte[] image = buffer.toByteArray();

                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .body(image);
            } else {
                return ResponseEntity.status(conn.getResponseCode()).build();
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
