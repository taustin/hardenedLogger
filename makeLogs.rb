require 'socket'

PORT = 9000

file_name = ARGV[0]

file = File.open(file_name, "r")
puts "Parsing #{file_name}"

while !file.eof?
  line = file.readline
  socket = TCPSocket.new("localhost", PORT)
  socket.write(rand(5).to_s + line)
  socket.close
  sleep(1)
end

file.close

