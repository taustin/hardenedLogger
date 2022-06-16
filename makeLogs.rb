require 'socket'

puts "Starting the logger..."

i = 0

file = File.open("./access.log", "r")
while !file.eof?
  line = file.readline
  socket = TCPSocket.new("localhost", 9000)
  socket.write(rand(6).to_s + line)
  socket.close
  sleep(1)
  i = i+1
end
file.close

