const { createRunOncePlugin, withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const MATERIAL_DEPENDENCY = "  implementation 'com.google.android.material:material:1.12.0'";

function withSuperwallAndroidMaterial(config) {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const gradlePath = path.join(
        modConfig.modRequest.projectRoot,
        "node_modules",
        "expo-superwall",
        "android",
        "build.gradle"
      );

      if (!fs.existsSync(gradlePath)) {
        return modConfig;
      }

      const contents = fs.readFileSync(gradlePath, "utf8");

      if (contents.includes("com.google.android.material:material")) {
        return modConfig;
      }

      const nextContents = contents.replace(
        /dependencies\s*\{\s*/,
        (match) => `${match}\n${MATERIAL_DEPENDENCY}\n`
      );

      fs.writeFileSync(gradlePath, nextContents);
      return modConfig;
    }
  ]);
}

module.exports = createRunOncePlugin(
  withSuperwallAndroidMaterial,
  "with-superwall-android-material",
  "1.0.0"
);
