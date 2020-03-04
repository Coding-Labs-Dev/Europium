# Read arguments passed to the script.
if [ -z "$1" ]; then
 ENVIRONMENT='development'
else
 ENVIRONMENT="$1"
fi

echo ""
echo "Migrating for environment: $ENVIRONMENT"
echo ""

echo " -> Step 1/3: Compiling migration scripts."
echo ""
for filename in ./src/database/migrations/*.ts; do
 yarn tsc -t es2017 -module CommonJS -outDir ./build-migrations $filename
done
echo ""
echo " -> Compilation completed."
echo ""

echo ""
echo " -> Step 2/3: Copying resources required for migration."
cp -rf ./src/database/dump ./build-migrations/database/
echo " -> Copying resources completed."
echo ""

echo ""
echo " -> Step 3/3: Starting migration."
echo ""
yarn cross-env NODE_ENV=$ENVIRONMENT sequelize db:migrate
echo ""
echo " -> Migration completed."
echo ""