"""Real Docker smoke test; Python stdlib only. Run from any directory."""
import json
from pathlib import Path
import subprocess
import unittest

SCRIPT = Path(__file__).resolve().parents[2] / "scripts" / "java-lab.sh"


class DockerWrapperTest(unittest.TestCase):
    def invoke(self, *args):
        return subprocess.run([str(SCRIPT), *args], text=True, capture_output=True,
                              timeout=300, check=False)

    def test_maven_bootstrap_has_no_native_library_error(self):
        result = self.invoke("test", "--version")
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertNotIn("Failed to load native library", result.stderr)
        self.assertNotIn("UnsatisfiedLinkError", result.stderr)

    def test_real_packaged_cli(self):
        self.assertTrue(SCRIPT.is_file(), "Docker wrapper must exist")
        build = self.invoke("build")
        self.assertEqual(0, build.returncode, build.stderr)
        self.assertEqual("", build.stdout)
        schema = self.invoke("schema")
        self.assertEqual(0, schema.returncode, schema.stderr)
        self.assertEqual("", schema.stderr)
        self.assertEqual(5, len(json.loads(schema.stdout)))
        listed = self.invoke("list")
        self.assertEqual(0, listed.returncode, listed.stderr)
        self.assertEqual("", listed.stderr)
        self.assertEqual(12, len(json.loads(listed.stdout)))
        result = self.invoke("search", "--status", "AWAITING_SHIPMENT", "--limit", "5")
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertEqual("", result.stderr)
        rows = json.loads(result.stdout)
        self.assertEqual([1004, 1002, 1009, 1007, 1001], [row["id"] for row in rows])
        invalid = self.invoke("search", "--status", "SHIPPED", "--limit", "11")
        self.assertEqual(2, invalid.returncode)
        self.assertEqual("", invalid.stdout)
        self.assertEqual("invalid_arguments", json.loads(invalid.stderr)["error"])


if __name__ == "__main__":
    unittest.main()
