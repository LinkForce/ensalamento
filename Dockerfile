FROM node:6.14.4
LABEL maintainer="horstmannmat <mch15@inf.ufpr.br>"

ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

#Install apt-utils to prevent warning messages
# RUN apt-get -y update -qq && apt-get -y upgrade -qq && apt-get install -y -qq apt-utils vim

# Set an environment variable to store where the app is installed to inside of the Docker image.
ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH


# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.

WORKDIR $INSTALL_PATH


COPY . .

# ENV NODE_ENV developement


RUN  yarn install

# RUN host ensalamento-postgres
#
# VOLUME ["$INSTALL_PATH/"]
#
ENV PATH=$PATH:/app/node_modules/.bin
EXPOSE 3000





ENTRYPOINT ["/app/ensalamento-entrypoint.sh"]

CMD ["DEVELOPMENT"]
