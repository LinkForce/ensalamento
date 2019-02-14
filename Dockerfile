FROM node:8.12-jessie
LABEL maintainer="horstmannmat <mch15@inf.ufpr.br>"

# Set an environment variable to prevent debian warning.
ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

# Set an environment variable to store where the app is installed to inside of the Docker image.
ENV WORKSPACE /app
RUN mkdir -p $WORKSPACE

# Install apt-utils to prevent warning messages
RUN apt-get -y update -qq && apt-get install -y -qq apt-utils vim



# Change WORKSPACE owner
RUN  chown -R node:node $WORKSPACE

# Change running user
USER node
# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.
# Set app directory
WORKDIR $WORKSPACE

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .

# If you are building your code for production
# RUN yarn install --production --frozen-lockfile --silent --non-interactive
RUN  yarn install --frozen-lockfile --silent --non-interactive

ENV PATH=$PATH:/app/node_modules/.bin
EXPOSE 3000



# Bundle app source
COPY --chown=node:node . .


ENTRYPOINT ["/app/ensalamento-entrypoint.sh"]

CMD ["DEVELOPMENT"]
