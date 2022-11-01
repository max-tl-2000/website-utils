function printWithTime() {
  echo -en " ▸  [$NOW] $1"
}

function resetColors() {
  echo -en "\033[0;39m"
}

function green() {
  echo -en "\033[0;32m"
}

function red() {
  echo -en "\033[31;1m"
}

function log() {
  NOW=$(date +"%H:%M:%S")

  green
  printWithTime "$1"
  resetColors
  echo
}

function warn() {
  red
  printWithTime "$1"
  resetColors
  echo
}

function logBlock() {
  NOW=$(date +"%H:%M:%S")

  echo ""
  echo -e "\033[0;36m================================================"
  echo -e " ▸  [$NOW] $1"
  echo -e "================================================\033[0;39m"
  echo ""
}

function getOS {
  local OS=''

  case "$(uname -s)" in
   Darwin)
     OS='Mac'
   ;;

   Linux)
     OS='Linux'
   ;;

   CYGWIN*|MINGW32*|MSYS*)
     OS='MSWin'
   ;;

   # Add here more strings to compare
   # See correspondence table at the bottom of this answer

   *)
     OS='Other'
   ;;
  esac

  echo "${OS}";
}
