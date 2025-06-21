{ pkgs, ... }: {
  # Use a stable Nixpkgs version
  channel = "stable-24.05";

  # Add dev packages you'll need
  packages = [
    pkgs.nodejs_20
    pkgs.nodePackages.firebase-tools
    pkgs.nodePackages.nodemon
    pkgs.git
  ];

  # Optional env vars
  env = {
    NODE_ENV = "development";
  };

  idx = {
    extensions = [
      "firebase.firebase-vscode"
      "esbenp.prettier-vscode"
      "dbaeumer.vscode-eslint"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };

    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        # You could also use this to start a dev watcher
        # functions-watch = "cd functions && npm run watch";
      };
    };
  };
}
