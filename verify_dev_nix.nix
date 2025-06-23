# verify_dev_nix.nix
let
  pkgs = import <nixpkgs> {};
  devConfig = import ./idx/dev.nix { inherit pkgs; };
in
builtins.trace "Dev Config Channel: ${devConfig.channel}"
builtins.trace "Dev Config Packages: ${builtins.toString devConfig.packages}"
builtins.trace "Dev Config Environment Variables: ${builtins.toString devConfig.env}"
builtins.trace "Dev Config IDX Extensions: ${builtins.toString devConfig.idx.extensions}"
builtins.trace "Dev Config IDX Previews Web Command: ${builtins.toString devConfig.idx.previews.previews.web.command}"
builtins.trace "Dev Config IDX Previews Web Env: ${builtins.toString devConfig.idx.previews.previews.web.env}"
builtins.trace "Dev Config IDX Workspace onCreate npm-install: ${devConfig.idx.workspace.onCreate."npm-install"}"
"Nix configuration verification complete. Check traces above."