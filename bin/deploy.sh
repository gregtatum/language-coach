
# Make the script URL relative.
#   From: <script defer src="/4c2dfd81560758af273c.bundle.js"></script></head>
#     To: <script defer src="4c2dfd81560758af273c.bundle.js"></script></head>

sed -i '' 's|src="/|src="|g' dist/index.html

cd dist                                                                 \
 && git init -b gh-pages                                                \
 && git remote add origin git@github.com:gregtatum/translation-asst.git \
 && git add .                                                           \
 && git commit -m "Deploy $(date)"                                      \
 && git push -f
